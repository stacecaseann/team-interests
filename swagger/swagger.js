const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Interests API',
    description:
      'This API allows users to see our interests endpoints and add/update/delete if authenticated.',
  },
  host: 'team-interests.onrender.com',
  basePath: '/',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpoints = [
  './routes/users.js',
  './routes/recipes.js',
  './routes/movies.js',
  './routes/conferenceSpeakers.js',
  './routes/favoritebooks.js',
  './routes/scriptures.js',
]; // Exclude index.js and home.js to prevent circular dependency

const runSwagger = async () => {
  // Skip swagger generation during tests
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
