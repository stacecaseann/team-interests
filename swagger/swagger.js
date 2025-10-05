// Moved swagger-autogen dependency from devDependencies to dependencies in package.json
// to ensure it's available in all environments
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpoints = ['../routes/index.js'];

const doc = {
  info: {
    title: 'Interests API',
    description:
      'This API allows users to see our interests endpoints and add/update/delete if authenticated.',
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  schemes: [process.env.SWAGGER_SCHEME || 'http'],
};

swaggerAutogen(outputFile, endpoints, doc);
