const { Applicant } = require("../helpers/sequelize");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all applicants
router.get("/", auth, (req, res, next) => {
  Applicant.findAll()
  .then((applicants) => {
    res.status(200).json({ applicants });
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
  .then((applicant) => res.status(201).json({ applicant }))
  .catch(() => res.status(400).json({ error: "Une erreur s'est produite." }));
});

module.exports = router;
