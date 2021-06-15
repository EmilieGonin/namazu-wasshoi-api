const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

//Connect to database
const sequelize = new Sequelize(process.env.LOCAL_DATABASE_URL, {
  logging: false
});

//Add models
const User = require("../models/User")(sequelize);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
})

User.prototype.passwordIsValid = async function(password) {
  return await bcrypt.compare(password, this.password);
}

sequelize.authenticate()
.then(() => console.log("Connexion à la base de données MySQL terminée !"))
.catch((error) => console.error("Impossible de se connecter à la base de données :", error));

sequelize.sync({ force: true })
.then(() => {
  console.log("Base de données synchronisée avec succès !");

  //Create admin user
User.findOrCreate({
    where: {
      email: process.env.ADMIN_EMAIL
    },
    defaults: {
    firstName: process.env.ADMIN_FIRST_NAME,
    lastName: process.env.ADMIN_LAST_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    isAdmin: true
  }})
})
.catch((error) => console.error(error));

module.exports = { User }
