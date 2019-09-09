const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  db("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
