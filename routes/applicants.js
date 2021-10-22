const { Applicant, Profile, Character, User } = require("../models/index");
const { transport, mailTemplate } = require("../helpers/nodemailer");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all applicants
router.get("/", auth, async (req, res, next) => {
  Applicant.findAll({
    include: [{
      model: Profile,
      attributes: { exclude: ["ApplicantId"] }
    }, {
      model: Character
    }]
  })
  .then((applicants) => res.status(200).json({ applicants }))
  .catch((e) => next(e));
});

//Post new applicant
router.post("/new", async (req, res, next) => {
  //Check if character doesn't already exist
  const character = await Character.findOne({
    where: { name: req.body.Character.name }
  });

  if (character) {
    const error = {
      status: 400,
      message: "Vous ne pouvez pas postuler à plusieurs reprises. S'il s'agit d'une erreur, veuillez nous contacter sur Discord."
    }
    next(error);
  }

  const applicant = await Applicant.create(req.body, {
    include: [ Profile, Character ]
  }).catch((e) => next(e));

  const staffMails = [];
  const staff = await User.findAll({
    where: { isAdmin: true },
    attributes: ["email"]
  }).catch((e) => next(e));

   for (const user of staff) {
     staffMails.push(user.email);
   }

  const message = `
    ${req.body.Character.name} (${req.body.Profile.discord}) a posté sa candidature sur le site !
  `
  for (const staffMail of staffMails) {
    const mail = mailTemplate(staffMail, "Une nouvelle candidature est disponible sur Namazu Wasshoi !", message);
    transport.sendMail(mail);
  }

  res.status(201).json({ message: "Merci ! Ta candidature a bien été envoyée." });
});

//Delete applicant
router.delete("/:id", auth, (req, res, next) => {
  Applicant.findByPk(req.params.id)
  .then((applicant) => {
    applicant.destroy()
    .then(() => res.status(200).json({ message: "La candidature a bien été supprimée." }))
    .catch((error) => res.status(500).json({ error: "Impossible de supprimer la candidature." }));
  })
  .catch((e) => next(e));
});

module.exports = router;
