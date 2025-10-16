const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Team Interests API',
    description:
      'This API allows users to view and manage interests. Some routes (POST, PUT, DELETE) are protected and require OAuth authentication.',
    version: '1.0.0',
  },
  host: 'team-interests.onrender.com',
  basePath: '/',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],

  // ✅ OAuth2 Security Configuration
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      scopes: {
        read: 'Grants read access',
        write: 'Grants write access',
      },
    },
  },

  // This adds the "Authorize" lock button to Swagger UI
  security: [{ OAuth2: [] }],

  definitions: {
    FavoriteBook: {
      _id: '60d21b4667d0d8992e610c85',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2008,
    },
  },
};

const outputFile = './swagger.json';
const endpoints = ['../server.js']; // Avoid index.js/home.js to prevent circular dependency

const runSwagger = async () => {
  // Prevent swagger generation during test runs
  if (process.env.NODE_ENV === 'test') {
    console.log('Skipping swagger generation in test environment');
    return;
  }

  try {
    await swaggerAutogen(outputFile, endpoints, doc);
    console.log('✅ Swagger documentation generated successfully.');
  } catch (err) {
    console.error('❌ Error generating Swagger documentation:', err);
  }
};

if (require.main === module) {
  runSwagger();
}

module.exports = runSwagger;
