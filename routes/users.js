const { User, Team, Profile, Character } = require("../models/index");
const { transport, mailTemplate } = require("../helpers/nodemailer");
const jwt = require("jsonwebtoken");
const fs = require('fs');
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
      const message = `
        Bienvenue parmi nous, ${req.body.Character.name} !<br/><br/>Tu peux désormais te connecter à ton compte en utilisant l'adresse email et le mot de passe que tu as renseigné lors de ton inscription.<br/><br/>En cas de problème, n'hésites pas à contacter la GM sur Discord ! (Yuuna#5839)
      `;
      const mail = mailTemplate(req.body.email, "Bienvenue sur Namazu Wasshoi !", message);
      transport.sendMail(mail);

      res.status(201).json({
        message: "Inscription validée !",
        user: user,
        token: jwt.sign(
          { userId: user.id },
          process.env.SECRET,
          { expiresIn: "24h" }
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

  if (await user.Character.hasExpired()) {
    await user.Character.getCharacter();
  }

  if (await user.passwordIsValid(req.body.password)) {
    res.status(200).json({
      message: "Connexion réussie !",
      user: user,
      token: jwt.sign(
        { userId: user.id },
        process.env.SECRET,
        { expiresIn: "24h" }
      )
    });
  }
  else {
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }
});

//Edit user
router.put("/:id", auth, (req, res, next) => {
  //Get data from request
  const data = req.file ?
  {
    ...JSON.parse(req.body.user),
    avatar: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  } : req.body;

  User.findByPk(req.params.id)
  .then((user) => {
    //Delete previous user avatar if necessary
    if ((req.file || data.deletefile) && user.avatar) {
      try {
        const filename = user.avatar.split("/uploads")[1];
        fs.unlinkSync(`uploads/${filename}`);
      } catch (e) {
        res.status(500).json({ error: "Impossible de supprimer l'ancien avatar." })
      }
    }

    //Update user
    user.update(data)
    .then((user) => {
      if (user) {
        res.status(200).json({ message: "Utilisateur mis à jour !", user: user });
      }
      else {
        res.status(500).json({ error: "Impossible de mettre à jour l'utilisateur'." });
      }
    })
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
