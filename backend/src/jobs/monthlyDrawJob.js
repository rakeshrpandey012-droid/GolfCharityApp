const cron = require("node-cron");

const Draw = require("../models/Draw");
const { generateUniqueNumbers } = require("../utils/drawEngine");
const { getMonthKey } = require("../controllers/drawController");

async function createMonthlyDraftDraw() {
  const month = getMonthKey();
  const existing = await Draw.findOne({ month });
  if (existing) {
    return;
  }

  await Draw.create({
    numbers: generateUniqueNumbers(5, 1, 45),
    type: "random",
    month,
    status: "draft"
  });
}

function startMonthlyDrawJob() {
  cron.schedule("0 0 1 * *", async () => {
    try {
      await createMonthlyDraftDraw();
      console.log("Monthly draw draft job executed");
    } catch (error) {
      console.error("Monthly draw job failed", error.message);
    }
  });
}

module.exports = {
  startMonthlyDrawJob,
  createMonthlyDraftDraw
};