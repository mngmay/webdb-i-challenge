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

router.post("/", validateAccount, (req, res) => {
  const newAccount = req.body;

  db("accounts")
    .insert(newAccount, "id")
    .then(([id]) => {
      db("accounts")
        .where({ id })
        .first()
        .then(account => {
          res.status(200).json(account);
        });
    })
    .catch(err => {
      res.json(err);
    });
});

// custom middleware

function validateAccount(req, res, next) {
  if (Object.keys(req.body).length < 1) {
    return res.status(400).json({ message: "Missing action data" });
  }

  if (!req.body.name || !req.body.budget) {
    return res
      .status(400)
      .json({ message: "Accounts require a valid name and budget" });
  }

  next();
}

module.exports = router;
