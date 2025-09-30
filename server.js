// Use dotenv to manage environment variables throughout the project
require('dotenv').config();

const express = require('express');
const app = express();
const mongodb = require('./database/connect');
const port = process.env.PORT || 3000;
const mainRoute = require('./routes/index');

// Middleware to parse JSON bodies - replaces body-parser so I deleted it from package.json
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.id, `Caught exception: ${err}\n` + `Exception origin: ${origin}`)
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

// Created mainRoute variable and used it here for better organization
app.use('/', mainRoute);

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () =>
      console.log(`Database is listening on port: ${port}`),
    );
  }
});
