const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

//Connect to database
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  logging: false
});

//Add models
const Team = require("../models/Team")(sequelize);
const User = require("../models/User")(sequelize);
const Festival = require("../models/Festival")(sequelize);
const Screenshot = require("../models/Screenshot")(sequelize);
const Parameter = require("../models/Parameter")(sequelize);

//Site default parameters
const parameters = [
  { name: "recruiting", data: "true" }
]

Team.hasMany(User);
User.belongsTo(Team);

User.hasMany(Screenshot, {
  onDelete: "CASCADE",
  foreignKey: {
    allowNull: false
  }
});
Screenshot.belongsTo(User);

Festival.hasMany(Screenshot);
Screenshot.belongsTo(Festival);

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
      character: process.env.ADMIN_CHARACTER,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true
    }
  })

  //Create Parameters
  for (const parameter of parameters) {
    Parameter.findOrCreate({
      where: {
        name: parameter.name
      },
      defaults: {
        name: parameter.name,
        data: parameter.data
      }
    })
  }
})
.catch((error) => console.error(error));

module.exports = { Team, User, Festival, Screenshot, Parameter }
