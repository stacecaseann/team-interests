// Moved swagger-autogen dependency from devDependencies to dependencies in package.json
// to ensure it's available in all environments
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Interests API',
    description:
      'This API allows users to see our interests endpoints and add/update/delete if authenticated.',
  },
  host: 'team-interests.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpoints = ['./routes/index.js'];

swaggerAutogen(outputFile, endpoints, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully.');
  })
  .catch((err) => {
    console.error('Error generating Swagger documentation:', err);
  });
