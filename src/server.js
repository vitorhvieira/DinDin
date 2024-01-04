require("dotenv").config();
const express = require("express");
const app = express();
const rotas = require("./rotas");
const swaggerRouter = require("./swagger/swagger");

app.use(express.json());
app.use(swaggerRouter);
app.use(rotas);

module.exports = app;
