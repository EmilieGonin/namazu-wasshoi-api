const { Festival, Screenshot, User, Vote } = require("../models/index");
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all festivals
router.get("/", (req, res, next) => {
  Festival.findAll({ include: Screenshot, order: [["edition", "DESC"]] })
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
    const voting = now > current.vote_date;
    const previousEdition = festival.edition - 1;

    //Find previous festival with current festival edition
    Festival.findOne({ where: { edition: previousEdition } })
    .then((festival) => {
      const previous = festival;
      previous.getWinners({ include: User })
      .then((winners) => res.status(200).json({ current, previous, winners, voting }))
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

//Add vote (FestivalId, UserId, ScreenshotId)
router.post("/vote", auth, (req, res, next) => {
  Festival.findByPk(req.body.FestivalId, { include: Vote })
  .then((festival) => {
    //Check if user has already vote on festival
    for (let vote of festival.Votes) {
      if (vote.UserId == req.body.UserId) {
        return res.status(401).json({ error: "Vous ne pouvez voter qu'une seule fois." })
      }
    }

    //Get Screenshot infos
    Screenshot.findByPk(req.body.ScreenshotId)
    .then((screenshot) => {
      //Check if user isn't voting for itself
      if (screenshot.UserId == req.body.UserId) {
        res.status(401).json({ error: "Vous ne pouvez pas voter pour votre propre participation." })
      } else {
        //Update screenshot votes count
        screenshot.update({votes: screenshot.votes + 1})
        .then(() => {
          //Create vote instance
          Vote.create(req.body)
          .then(() => res.status(200).json({ message: "Merci ! Votre vote a bien été pris en compte." }));
        })
      }
    })
  })
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Create new festival
router.post("/", auth, (req, res, next) => {
  Festival.create(req.body)
  .then(() => res.status(200).json({ message: "Le festival a bien été créé !" }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

module.exports = router;
