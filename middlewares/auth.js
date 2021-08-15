const { User } = require("../models/index");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //Check for headers authorization
    if (!req.headers.authorization) {
      throw "Authentification requise.";
    }

    //Get user id from the authorization token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;

    //Check if user exists on the database
    User.findByPk(userId)
    .then((user) => {
      if (user) {
        //Save user id on the request if needed
        // req.userId = userId;
        next();
      }
      else {
        throw "Utilisateur inexistant.";
      }
    })
    .catch((error) => res.status(404).json({ error: error }));
  }
  catch(e) {
    res.status(401).json({ error: e });
  }
};
