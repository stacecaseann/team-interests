const swaggerAutogen = require('swagger-autogen')();

const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'Interests API',
    description:
      'This API allows users to see our interests endpoints and add/update/delete if authenticated.',
  },
  host: ['team-interests.onrender.com', 'localhost:3000'],
  basePath: '/',
  schemes: ['https', 'http'], //
};

const outputFile = './swagger.json';
const endpoints = ['../routes/index.js'];

const runSwagger = async () => {
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