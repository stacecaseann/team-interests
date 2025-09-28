const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MyInterests Api',
    description: 'MyInterests Api',
  },
};
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//this generates swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
