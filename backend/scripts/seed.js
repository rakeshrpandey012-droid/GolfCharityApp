const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Charity = require("../src/models/Charity");
const Subscription = require("../src/models/Subscription");
const Draw = require("../src/models/Draw");
const Winner = require("../src/models/Winner");
const Score = require("../src/models/Score");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@golfplatform.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Platform Admin";

const charities = [
  {
    name: "First Tee Youth Golf",
    description: "Helping young people build life skills through golf.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b"
  },
  {
    name: "Clean Water Global",
    description: "Funding clean water projects in underserved communities.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  },
  {
    name: "Children Cancer Support",
    description: "Supporting treatment and family care for children with cancer.",
    image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f"
  },
  {
    name: "World Wildlife Fund",
    description: "Conserving nature and reducing the most pressing threats to the diversity of life on Earth.",
    image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def"
  },
  {
    name: "Habitat for Humanity",
    description: "Building strength, stability, and self-reliance through shelter.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca"
  },
  {
    name: "Doctors Without Borders",
    description: "Providing independent, impartial medical humanitarian assistance.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309"
  }
];

async function seedCharities() {
  for (const charity of charities) {
    await Charity.updateOne(
      { name: charity.name },
      { $set: charity },
      { upsert: true }
    );
  }
}

async function seedAdmin() {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (!existing) {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      subscriptionStatus: "active",
      charityPercentage: 10
    });
    return;
  }

  existing.role = "admin";
  existing.name = ADMIN_NAME;
  if (process.env.SEED_RESET_ADMIN_PASSWORD === "true") {
    existing.password = ADMIN_PASSWORD;
  }
  await existing.save();
}

async function seedMockAnalytics() {
  console.log("Seeding Mock Analytics for Dashboard...");
  
  // Clean up previous seed users
  await User.deleteMany({ email: { $regex: /^testuser\d+@golf\.com$/ } });

  // Create 20 Fake Users
  const charityDocs = await Charity.find();
  if (charityDocs.length === 0) return;

  for (let i = 1; i <= 20; i++) {
      const u = await User.create({
          name: `Test User ${i}`,
          email: `testuser${i}@golf.com`,
          password: "Password123",
          role: "user",
          subscriptionStatus: "active",
          charity: charityDocs[Math.floor(Math.random() * charityDocs.length)]._id,
          charityPercentage: 15
      });

      // Add Active Subscriptions
      await Subscription.create({
          user: u._id,
          plan: "yearly",
          amount: 99.99,
          status: "active",
          startDate: new Date(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      });
  }

  // Clear existing draws safely to avoid duplicates if run multiple times
  await Draw.deleteMany({});
  
  // Create 6 Months of pristine Draw History
  const months = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  let jCF = 0;
  
  for (let m of months) {
      const revenue = Math.floor(Math.random() * 5000) + 15000; // random 15k to 20k
      const subscribers = Math.floor(Math.random() * 50) + 1500;
      const totalPool = Math.floor(revenue * 0.4); // 40% goes to pool
      const charityAmount = Math.floor(revenue * 0.15); // 15% goes to charity
      
      const draw = await Draw.create({
          month: m,
          status: "published",
          numbers: [Math.floor(Math.random()*45)+1, Math.floor(Math.random()*45)+1, Math.floor(Math.random()*45)+1, Math.floor(Math.random()*45)+1, Math.floor(Math.random()*45)+1],
          totalPool: totalPool,
          subscriberCount: subscribers,
          charityAmount: charityAmount,
          jackpotCarryForward: jCF
      });

      // Jackpot carries forward randomly
      if (Math.random() > 0.5) {
          jCF += Math.floor(totalPool * 0.4); 
      } else {
          jCF = 0; // Jackpot won
      }
      
      // Update Charity aggregate values
      await Charity.updateMany({}, { $inc: { totalDonations: Math.floor(charityAmount / 3) }});
  }

  console.log("Mock Analytics generated successfully!");
}

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);
    await seedCharities();
    await seedAdmin();
    await seedMockAnalytics();

    const charityCount = await Charity.countDocuments();
    console.log("Seed complete");
    console.log(`Admin email: ${ADMIN_EMAIL}`);
    console.log(`Admin password: ${ADMIN_PASSWORD}`);
    console.log(`Total charities: ${charityCount}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

run();