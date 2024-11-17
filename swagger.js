const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Users API',
    description: 'Users API'
  },
  host: 'localhost:8081',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
