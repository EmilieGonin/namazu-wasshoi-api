const { Parameter } = require("../models/index");
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  Parameter.findAll()
  .then((parameters) => {
    res.status(200).json({ parameters });
  })
  .catch((e) => next(e));
});
router.get("/:name", (req, res, next) => {
  Parameter.findOne({ where: { name: req.params.name }})
  .then((parameter) => {
    res.status(200).json({ parameter });
  })
  .catch((e) => next(e));
});
router.put("/:id", (req, res, next) => {
  Parameter.findByPk(req.params.id)
  .then((parameter) => {
    parameter.update({ data: !parameter.data }).then(() => res.status(200).json({ message: "Le paramètre a bien été modifié !" }))
  })
  .catch((e) => next(e));
});

module.exports = router;
