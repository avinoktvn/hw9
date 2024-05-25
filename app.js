const express = require("express");
const app = express();
const router = require("./routes");
// const pool = require("./config/config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;
app.listen(3000);
