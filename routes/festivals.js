const { Festival, Screenshot } = require("../models/index");
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();

//Get all festivals
router.get("/", (req, res, next) => {
  Festival.findAll()
  .then((festivals) => res.status(200).json({ festivals }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Get previous and current festivals
router.get("/now", (req, res, next) => {
  const now = new Date();

  //Find current festival with date
  Festival.findOne({
    where: {
      start_date: {
        [Op.lte]: now
      },
      end_date: {
        [Op.gte]: now
      }
    }, include: Screenshot
  })
  .then((festival) => {
    const current = festival;
    const previousId = festival.id - 1;

    //Find previous festival with current festival id
    Festival.findByPk(previousId)
    .then((festival) => {
      const previous = festival;
      previous.getWinners()
      .then((winners) => res.status(200).json({ current, previous, winners }))
    })
  })
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Get one festival by id
router.get("/:id", (req, res, next) => {
  Festival.findByPk(req.params.id)
  .then((festival) => res.status(200).json({ festival }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

module.exports = router;
