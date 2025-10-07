// Use dotenv to manage environment variables throughout the project
require('dotenv').config();

const express = require('express');
const app = express();
const mongodb = require('./database/connect');
const cors = require('cors');
const PORT = process.env.PORT;
const mainRoute = require('./routes/index');
const runSwagger = require('./swagger/swagger');
runSwagger();

// Middleware to parse JSON bodies - replaces body-parser so I deleted it from package.json
app.use(express.json());
app.use(cors());

// Global error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.error(
    `Caught exception: ${err}\n` +
      `Exception origin: ${origin}\n` +
      `Stack: ${err.stack}`,
  );

  process.exitCode = 1; // Indicate an uncaught exception occurred
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    'Unhandled Rejection at:',
    promise,
    'reason:',
    reason,
    'Stack:',
    reason.stack,
  );

  process.exitCode = 2; // Indicate an unhandled rejection occurred
});

// CORS Middleware
app.use(cors());

// Created mainRoute variable and used it here for better organization
app.use('/', mainRoute);

// Added error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

async function startServer() {
  try {
    await mongodb.initDb();
    app.listen(PORT, () =>
      console.log(`Database is listening on port: ${PORT}`),
    );
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
