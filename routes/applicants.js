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
  const applicant = await Applicant.create(req.body, {
    include: [ Profile, Character ]
  }).catch(() => {
    const error = {
      status: 400,
      message: "Une erreur s'est produite. Si vous aviez déjà postulé, vous ne pourrez pas le faire une seconde fois."
    }
    next(error);
  })

  const staffMails = [];
  const staff = await User.findAll({
    where: { isAdmin: true },
    attributes: ["email"]
  }).catch((e) => next(e));

   for (const user of staff) {
     staffMails.push(user.email);
   }

  const message = `
    ${applicant.character} (${applicant.discord}) a posté sa candidature sur le site !
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
    .then(() => res.status(200).json({ message: "Candidature supprimée !" }))
    .catch((error) => res.status(500).json({ error: "Impossible de supprimer la candidature." }));
  })
  .catch((e) => next(e));
});

module.exports = router;
