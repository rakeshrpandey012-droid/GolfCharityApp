require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity';
console.log('Connecting to MongoDB at:', mongoUri);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Add your routes here
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/scores', require('./src/routes/scoreRoutes'));
app.use('/api/charities', require('./src/routes/charityRoutes'));
app.use('/api/draws', require('./src/routes/drawRoutes'));
app.use('/api/subscriptions', require('./src/routes/subscriptionRoutes'));
app.use('/api/winners', require('./src/routes/winnerRoutes'));

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  // Serve SPA entry point for any unmatched route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;