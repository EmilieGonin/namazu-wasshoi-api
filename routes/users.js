const { User, Team } = require("../models/index");
const { transport, mailTemplate } = require("../helpers/nodemailer");
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

//Get all users
router.get("/", auth, (req, res, next) => {
  User.findAll()
  .then((members) => res.status(200).json({ members }))
  .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Gel user by id (params)
router.get("/:id", auth, (req, res, next) => {
  User.findByPk(req.params.id)
  .then((user) => {
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "Utilisateur introuvable." });
    }
  })
  .catch((error) => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Signup
router.post("/signup", (req, res, next) => {
  Team.findOne({ where: { name: req.body.team }})
  .then((team) => {
    team.createUser({
      email: req.body.email,
      password: req.body.password,
      character: req.body.character_cl,
      characterId: req.body.characterId,
      discord: req.body.discord
    })
    .then((user) => {
      const message = `
        Bienvenue parmi nous, ${req.body.character_cl} !<br/><br/>Tu peux désormais te connecter à ton compte en utilisant l'adresse email et le mot de passe que tu as renseigné lors de ton inscription.<br/><br/>En cas de problème, n'hésites pas à contacter la GM sur Discord ! (Yuuna#5839)
      `;
      const mail = mailTemplate(req.body.email, "Bienvenue sur Namazu Wasshoi !", message);
      transport.sendMail(mail);

      res.status(201).json({
        user: user,
        token: jwt.sign(
          { userId: user.id },
          process.env.SECRET,
          { expiresIn: "24h" }
        )
      })
    })
    .catch(() => res.status(400).json({ error: "Vérifiez que vos données soient exactes ou que vous ne possédez pas déjà un compte associé à ce personnage." }));
  })
  .catch((error) => res.status(500).json({ error: "Une erreur s'est produite." }));
});

//Login
router.post("/login", (req, res, next) => {
  User.findOne({ where: { email: req.body.email }})
  .then(user => {
    if (user.passwordIsValid(req.body.password)) {
      res.status(200).json({
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
  })
  .catch(() => res.status(401).json({ error: "Connexion impossible." }));
});

//Update user
router.put("/:id", auth, (req, res, next) => {
  //
});

//Delete user
router.delete("/:id", auth, (req, res, next) => {
  User.findByPk(req.params.id)
  .then((user) => {
    user.destroy()
    .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
    .catch((error) => res.status(500).json({ error: "Impossible de supprimer l'utilisateur." }));
  })
  .catch((error) => res.status(500).json({ error: "Une erreur s'est produite." }));
});

module.exports = router;
