const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FastMusik Songs Microservice API",
      version: "1.0.0",
      description:
        "Specification of models and endpoints for communication and integration with the service offered by ms-songs."
    },
    servers: [{
      url: "https://songs-fastmusik-marmolpen3.cloud.okteto.net/api/v1",
      description: "Production server"
    }],
  },
  apis: ["./docs/**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app) => {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = { swaggerDocs };
