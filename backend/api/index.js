const app = require("../src/app");

// Vercel expects a function with (req, res). Export a handler that invokes
// the Express app to ensure compatibility with the serverless runtime.
module.exports = (req, res) => app(req, res);