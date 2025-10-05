// Use dotenv to manage environment variables throughout the project
require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const mongodb = require('./database/connect');

const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const PORT = process.env.PORT;
const mainRoute = require('./routes/index');

// Middleware to parse JSON bodies - replaces body-parser so I deleted it from package.json
app.use(express.json());

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

app
  .use(bodyparser.json())
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  )

  // Basic express session({..}) initialization.
  .use(passport.initialize())
  // init passport on every route call.
  .use(passport.session())
  // allow passport to use "express-session".
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, OPTIONS, DELETE',
    );
    next();
  });

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Created mainRoute variable and used it here for better organization
app.use('/', mainRoute);

// Added error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true,
  }),
  (req, res) => {
    const githubUser = req.user;

    const username = githubUser.username || githubUser.login || 'Unknown';

    req.session.user = {
      username,
      id: githubUser.id,
      avatar: githubUser.avatar_url,
    };

    console.log(`✅ Logged in as ${username}`);
    console.log('GitHub profile:', githubUser);

    res.redirect('/');
  },
);

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
