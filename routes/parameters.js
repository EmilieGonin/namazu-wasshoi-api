const { Parameter } = require("../models/index");
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  Parameter.findAll()
  .then((parameters) => {
    res.status(200).json({ parameters });
  })
  .catch(() => {
    res.status(500).json({ error: "Une erreur s'est produite." });
  });
});
router.get("/:name", (req, res, next) => {
  Parameter.findOne({ where: { name: req.params.name }})
  .then((parameter) => {
    res.status(200).json({ parameter });
  })
  .catch(() => {
    res.status(500).json({ error: "Une erreur s'est produite." });
  });
});

module.exports = router;
