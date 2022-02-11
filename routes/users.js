const { User, Team, Profile, Character } = require("../models/index");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const multer = require("../middlewares/multer");
const cloudinary = require('cloudinary').v2;
const emptyTemp = require("../middlewares/emptyTemp");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all users
router.get("/", auth, async (req, res, next) => {
  const users = await User.findAll({
    include: [{
      model: Profile,
      attributes: { exclude: ["UserId", "bio", "avatar", "mic"] }
    }, {
      model: Character
    }]
  }).catch((e) => next(e));

  for (const user of users) {
    if (await user.Character.hasExpired()) {
      await user.Character.getCharacter();
    }
  }

  res.status(200).json({ users })
});

//Get all users by roles
router.get("/roles", async (req, res, next) => {
  let golden = await User.findAll({
    where: {
      isGolden: true
    },
    include: [ Character ]
  }).catch((e) => next(e));

  if (golden.length) {
    const users = [];
    for (const user of golden) {
      users.push(user.Character.name)
    }

    golden = users;
  }

  let lunar = await User.findOne({
    where: {
      isLunar: true
    },
    include: [ Character ]
  }).catch((e) => next(e));

  if (lunar) {
    lunar = lunar.Character.name;
  }

  let fail = await User.findOne({
    where: {
      isFail: true
    },
    include: [ Character ]
  }).catch((e) => next(e));

  if (fail) {
    fail = fail.Character.name;
  }

  const roles = {
    golden: golden.length ? golden : null,
    lunar: lunar ? lunar : null,
    fail: fail ? fail : null
  }

  res.status(200).json({ roles });
});

//Update user character
router.get("/:id/character", async (req, res, next) => {
  User.findByPk(req.params.id, {
    include: [ Profile, Character ]
  })
  .then((user) => {
    user.Character.getCharacter()
    .then(() => {
      res.status(200).json({ user })
    });
  })
  .catch((e) => next(e));
});

//Get user by id (params)
router.get("/:id", auth, (req, res, next) => {
  User.findByPk(req.params.id, {
    include: [ Profile, Character ]
  })
  .then((user) => {
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "Utilisateur introuvable." });
    }
  })
  .catch((e) => next(e));
});

//Get User id by Character name (req.body)
router.post("/character", auth, async (req, res, next) => {
  Character.findOne({ where: {
    name: req.body.name
  }})
  .then((character) => {
    if (character && character.UserId) {
      res.status(200).json({ id: character.UserId });
    } else {
      res.status(404).json({ error: "Ce personnage ne possède pas encore de profil." });
    }
  })
  .catch((e) => next(e));
});

//Signup
router.post("/signup", (req, res, next) => {
  Team.findOne({ where: { name: req.body.team }})
  .then((team) => {
    team.createUser(req.body, {
      include: [ Profile, Character ]
    })
    .then((user) => {
      res.status(201).json({
        message: "Inscription validée !",
        user: user,
        token: jwt.sign(
          { userId: user.id },
          process.env.SECRET
        )
      })
    })
    .catch((e) => {
      User.destroy({ where: { email: req.body.email }}).then(() =>
        res.status(400).json({ error: "Vérifiez que vos données soient exactes ou que vous ne possédez pas déjà un compte associé à ce personnage." })
      )
    });
  })
  .catch((e) => next(e));
});

//Login
router.post("/login", async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.body.email },
    include: [ Profile, Character ]
  }).catch(() => res.status(401).json({ error: "Connexion impossible." }));

  if (user.Character && await user.Character.hasExpired()) {
    await user.Character.getCharacter();
  }

  if (await user.passwordIsValid(req.body.password)) {
    res.status(200).json({
      message: "Connexion réussie !",
      user: user,
      token: jwt.sign(
        { userId: user.id },
        process.env.SECRET
      )
    });
  }
  else {
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }
});

//Edit user
router.post("/:id", auth, multer, async (req, res, next) => {
  //Get data from request
  let data;
  if (req.file) {
    //Upload avatar
    await cloudinary.uploader.upload(req.file.path, { folder: "avatars", quality: "auto:best", format: "jpg" }, (e, upload) => {
      if (e) {
        return next(e);
      } else {
        emptyTemp();
        data = JSON.parse(req.body.user);
        if (data.Profile) {
          data.Profile.avatar = upload.url;
          data.Profile.avatar_public_id = upload.public_id;
        } else {
          data.Profile = {
            avatar: upload.url,
            avatar_public_id: upload.public_id
          }
        }
      }
    })
  } else {
    data = req.body;
  }

  await User.update(data, { where: { id: req.params.id } })
  .catch((e) => next(e));

  if (data.Profile || data.deleteFile) {
    const [profile, created] = await Profile.findOrCreate({
      where: { UserId: req.params.id }
    }).catch((e) => next(e));

    //Delete previous user avatar if necessary
    if ((req.file || data.deleteFile) && profile.avatar) {
      cloudinary.uploader.destroy(profile.avatar_public_id, (e, result) => {
        if (e) {
          res.status(500).json(e)
        }
      })
    }

    if (data.deleteFile) {
      profile.avatar = null;
      profile.avatar_public_id = null;
      await profile.save();
    }

    await profile.update(data.Profile).catch((e) => next(e));
  }

  const user = await User.findByPk(req.params.id, {
    include: [ Profile, Character ]
  })
  .then(user => {
    res.status(200).json({ message: "Utilisateur mis à jour !", user: user });
  })
  .catch((e) => next(e));
});

//Delete user
router.delete("/:id", auth, (req, res, next) => {
  User.findByPk(req.params.id)
  .then((user) => {
    user.destroy()
    .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
    .catch((error) => res.status(500).json({ error: "Impossible de supprimer l'utilisateur." }));
  })
  .catch((e) => next(e));
});

module.exports = router;
