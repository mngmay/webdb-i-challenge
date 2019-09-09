const express = require("express");

const db = require("./data/dbConfig.js");

const AccountsRouter = require("./accounts/accountsRouter");

const server = express();

server.use(express.json());

server.use("/accounts", AccountsRouter);

server.get("/", (req, res) => {
  res.send("<h3>Server works</h3>");
});

module.exports = server;
