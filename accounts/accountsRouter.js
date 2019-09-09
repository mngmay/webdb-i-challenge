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

router.get("/:id", validateAccountId, (req, res) => {
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

router.put("/:id", validateAccountId, (req, res) => {
  const changes = req.body;

  if (Object.keys(changes) < 1) {
    return res.status(400).json({ error: "Missing property data." });
  }

  db("accounts")
    .where("id", req.params.id)
    .update(changes)
    .then(count => {
      res.status(200).json({ message: `Updated ${count} records` });
    })
    .catch(err => res.json(err));
});

router.delete("/:id", validateAccountId, (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `deleted ${count} records` });
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

function validateAccountId(req, res, next) {
  db("accounts")
    .where("id", req.params.id)
    .then(([account]) => {
      if (account) {
        next();
      } else {
        res.status(400).json({ message: "Invalid account id." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The account could not be retrieved." });
    });
}

module.exports = router;
