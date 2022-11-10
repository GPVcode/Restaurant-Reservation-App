const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
//const searchRouter = require("./search/search.router");
//require tables router

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reservations", reservationsRouter);
//create tables router
//app.use("/tables", tablesRouter);
//app.use("/search", searchRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
