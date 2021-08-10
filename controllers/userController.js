const { User } = require("../helpers/sequelize");
const jwt = require("jsonwebtoken");
// const fs = require('fs');

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
  const user = User.create({
    email: req.body.email,
    password: req.body.password,
    character: req.body.character_cl,
    characterId: req.body.characterId,
    discord: req.body.discord
  })
  .then((user) => res.status(201).json({
    user: user,
    token: jwt.sign(
      { userId: user.id },
      process.env.SECRET,
      { expiresIn: "24h" }
    )
  }))
  .catch(() => res.status(400).json({ error: "Vérifiez que vos données soient exactes ou que votre adresse email ne soit pas déjà utilisée." }));
};
exports.userLogin = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
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
