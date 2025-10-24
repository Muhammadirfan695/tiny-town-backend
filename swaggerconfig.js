const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Local Bites',
      version: '1.0.0',
      description:'Local Bites API documentation.'
    },
  };
  
  const options = {
    swaggerDefinition,
    apis: ['./docs/*.js'], // Path to API doc files
  };
  
  const swaggerSpec = swaggerJsdoc(options);
  
  module.exports = { swaggerUi, swaggerSpec };