const express = require("express");
const swaggerJsdoc = require("../../swaggerDocument.json");
const swaggerUi = require("swagger-ui-express");

const swaggerRouter = express();

swaggerRouter.get("/", swaggerUi.setup(swaggerJsdoc));
swaggerRouter.use(swaggerUi.serve);

module.exports = swaggerRouter;
