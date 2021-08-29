const { Screenshot, User, Festival } = require("../models/index");
const multer = require("../middlewares/multer");
const cloudinary = require('cloudinary').v2;
const emptyTemp = require("../middlewares/emptyTemp");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get screenshot by id
router.get("/:id", (req, res, next) => {
  Screenshot.findByPk(req.params.id)
  .then((screenshot) => res.status(200).json({ screenshot }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Upload screenshot (file, UserId, FestivalId ?, description ?)
router.post("/", auth, multer, async (req, res, next) => {
  const filename = req.file.filename;
  const file = "./temp/" + filename;
  let message = "Le screenshot a bien été enregistré !";
  let festival = false;

  if (req.body.FestivalId) {
    message = "Merci ! Votre participation a bien été enregistrée.";
    festival = await Festival.findByPk(req.body.FestivalId, { include: Screenshot }).catch(e => next(e));

    //Check if user has already submit screenshot on festival
    for (let screenshot of festival.Screenshots) {
      if (screenshot.UserId == req.body.UserId) {
        const error = {
          status: 401,
          message: "Vous ne pouvez participer qu'une seule fois."
        }
        return next(error);
      }
    }
  }

  //Upload screenshot
  cloudinary.uploader.upload(file, { public_id: filename }, (e, upload) => {
    if (e) {
      return next(e);
    } else {
      Screenshot.create({
        url: upload.url,
        public_id: upload.public_id,
        description: req.body.description ? req.body.description : null,
        festival: festival ? festival.edition : null,
        UserId: req.body.UserId
      })
      .then(() => {
        emptyTemp();
        res.status(200).json({ message: message });
      })
      .catch(e => next(e));
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
