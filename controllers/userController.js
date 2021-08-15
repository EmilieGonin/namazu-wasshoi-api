const { User, Team } = require("../models/index");
const { transport, mailTemplate } = require("../helpers/nodemailer");
const jwt = require("jsonwebtoken");
// const fs = require('fs');

//Get all users
exports.getAllUsers = (req, res, next) => {
  User.findAll()
  .then((members) => {
    if (members.length > 0) {
      res.status(200).json({ members });
    } else {
      res.status(404).json({ error: "Aucun membre trouvé." });
    }
  })
  .catch(() => {
    res.status(500).json({ error: "Une erreur s'est produite." });
  });
};
exports.getUser = (req, res, next) => {
  User.findByPk(req.params.id)
  .then((user) => {
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "Utilisateur introuvable." });
    }
  })
  .catch((error) => res.status(500).json({ error: "Une erreur s'est produite." }));
};
exports.userSignup = (req, res, next) => {
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
};
exports.userLogin = (req, res, next) => {
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
  .catch(() => res.status(401).json({ error: "Utilisateur non trouvé." }));
};
exports.userUpdate = (req, res, next) => {
  //
}
exports.userDelete = (req, res, next) => {
  //
}
