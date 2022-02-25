const { User } = require("../models/index");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const error = {
    status: 401,
    message: "Vous n'avez pas l'autorisation d'accéder à cette page."
  }

  //Check for headers authorization
  if (!req.headers.authorization) {
    next(error);
  } else {
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
        next(error);
      }
    })
    .catch((e) => next(e));
  }
};
