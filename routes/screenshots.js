const { Screenshot, User } = require("../models/index");
const multer = require("../middlewares/multer");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get screenshot by id
router.get("/:id", (req, res, next) => {
  Screenshot.findByPk(req.params.id)
  .then((screenshot) => res.status(200).json({ screenshot }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Upload screenshot
router.post("/", auth, multer, (req, res, next) => {
  const filename = req.file.filename;
  const file = "./temp/" + filename;

  cloudinary.uploader.upload(file, { public_id: filename }, (e, upload) => {
    if (e) {
      return res.status(500).json(e);
    } else {
      Screenshot.create({
        url: upload.url,
        public_id: upload.public_id,
        description: req.body.description ? req.body.description : null,
        UserId: req.body.userId
      })
      .then(() => res.status(200).json({ message: "Le screenshot a bien été enregistré !" }))
    }
  })
});

//Delete screenshot by model id and public_id
router.delete("/:id", auth, (req, res, next) => {
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
