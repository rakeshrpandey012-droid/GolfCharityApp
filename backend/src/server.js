const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth.js');
const scoreRoutes = require('./routes/scoreRoutes.js');
const drawRoutes = require('./routes/drawRoutes.js');
const charityRoutes = require('./routes/charityRoutes.js');
const subscriptionRoutes = require('./routes/subscriptionRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const winnerRoutes = require('./routes/winnerRoutes.js');
const adminDrawRoutes = require('./routes/adminDrawRoutes.js');

dotenv.config();

const app = express();

// ============================================
// 1. MIDDLEWARE SETUP
// ============================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://digital-heroes-41vy.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS BLOCKED: ${origin}`);
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// 2. DATABASE CONNECTION
// ============================================
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    
    if (!MONGO_URI) {
      throw new Error('MONGODB_URI not defined in .env');
    }

    await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
  connectDB();
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB Error:', error);
});

// ============================================
// 3. ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Auth & Users
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Business Logic
app.use('/api/scores', scoreRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/admin/draws', adminDrawRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ============================================
// 4. ERROR HANDLING MIDDLEWARE
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// ============================================
// 5. SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  🌍 GolfWin Server Running             ║
║  PORT: ${PORT}                           ║
║  ENV: ${process.env.NODE_ENV || 'development'}                    ║
║  API: http://localhost:${PORT}/api      ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
