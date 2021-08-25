const { Screenshot, User } = require("../models/index");
const multer = require("../middlewares/multer");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const express = require('express');
const router = express.Router();

//Get screenshot by id
router.get("/:id", (req, res, next) => {
  Screenshot.findByPk(req.params.id)
  .then((screenshot) => res.status(200).json({ screenshot }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Upload screenshot
router.post("/", multer, (req, res, next) => {
  const file = "./temp/" + req.file.filename;

  User.findByPk(req.body.userId)
  .then((user) => {
    if (user) {
      cloudinary.uploader.upload(file, {
        public_id: req.file.filename },
        (e, upload) => {
        if (e) {
          res.status(500).json(e)
        } else {
          user.createScreenshot({
            url: upload.url,
            public_id: upload.public_id,
            description: req.body.description,
            festival: req.body.festival ? req.body.festival : null
          })
          .then(() => res.status(200).json({ message: "Le screenshot a bien été enregistré !" }))
        }
      })
    } else {
      res.status(404).json({ error: "Utilisateur introuvable." });
    }
  })
});

//Delete screenshot by model id and public_id
router.delete("/:id", (req, res, next) => {
  Screenshot.findByPk(req.params.id)
  .then((screenshot) => {
    cloudinary.uploader.destroy(screenshot.public_id, (e, result) => {
      if (e) {
        res.status(500).json(e)
      } else {
        screenshot.destroy()
        .then(() => res.status(200).json("Le Screenshot a bien été supprimé !"))
        .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
      }
    })
  })
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

module.exports = router;
