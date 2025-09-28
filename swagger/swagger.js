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
  host: 'team-interests.onrender.com',
  schemes: ['https'],
};

swaggerAutogen(outputFile, endpoints, doc);
