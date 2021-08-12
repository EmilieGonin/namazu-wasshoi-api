const { Applicant } = require("../helpers/sequelize");
const { transport, mailTemplate } = require("../helpers/nodemailer");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all applicants
router.get("/", auth, (req, res, next) => {
  Applicant.findAll()
  .then((applicants) => {
    if (applicants.length > 0) {
      res.status(200).json({ applicants });
    } else {
      res.status(404).json({ error: "Aucune candidature disponible." });
    }
  })
  .catch(() => {
    res.status(500).json({ error: "Une erreur s'est produite." });
  });
});
//Post new applicant
router.post("/new", (req, res, next) => {
  const applicant = {}

  for (const data of Object.entries(req.body)) {
    const name = data[0];
    let value = data[1];
    if (value == "true" || value == "false") {
      value = !!value;
    }
    applicant[name] = value;
  }

  Applicant.create(applicant)
  .then((applicant) => {
    const staffMails = process.env.STAFF_MAILS.split(",");
    const message = `
      ${applicant.character} (${applicant.discord}) a posté sa candidature sur le site !
    `
    for (const staffMail of staffMails) {
      const mail = mailTemplate(staffMail, "Une nouvelle candidature est disponible sur Namazu Wasshoi !", message);
      transport.sendMail(mail);
    }

    res.status(201).json({ applicant });
  })
  .catch(() => res.status(400).json({ error: "Une erreur s'est produite. Si vous aviez déjà postulé, vous ne pourrez pas le faire une seconde fois. " }));
});

module.exports = router;
