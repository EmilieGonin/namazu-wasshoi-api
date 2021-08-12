const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

//Connect to database
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  logging: false
});

//Add models
const Applicant = require("../models/Applicant")(sequelize);
const Team = require("../models/Team")(sequelize);
const User = require("../models/User")(sequelize);
const Festival = require("../models/Festival")(sequelize);
const Screenshot = require("../models/Screenshot")(sequelize);
const Parameter = require("../models/Parameter")(sequelize);

//Site default parameters
const parameters = [
  { name: "recruiting", data: "true" }
]
const teams = [
  { name: "Mog", slogan: "Pas de coups sous le pompon !" },
  { name: "Chocobo", slogan: "On est chaud... cobo !" },
  { name: "Pampa", slogan: "Qui s'y frotte s'y pique !" },
  { name: "Carbuncle", slogan: "Que la poussière de diamant vous réduise en éclat !" }
]

Team.hasMany(User, { sourceKey: "name", foreignKey: "team" });
User.belongsTo(Team, { targetKey: "name", foreignKey: "team" });

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

User.prototype.passwordIsValid = function(password) {
  return bcrypt.compareSync(password, this.password);
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
      characterId: process.env.ADMIN_CHARACTER_ID,
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

  //Create Teams
  for (const team of teams) {
    Team.findOrCreate({
      where: {
        name: team.name
      },
      defaults: {
        name: team.name,
        slogan: team.slogan
      }
    })
  }

  //Applicant for testing
  Applicant.create({
    name: "Emilie",
    birthday: "1996-05-27",
    discord: "Yuuna#5839",
    mic: true,
    availability: process.env.LOREM,
    about: "Test",
    character: "Yuuna Tsukisagi",
    characterId: 12177359,
    mainClass: process.env.LOREM,
    playtime: process.env.LOREM,
    gameActivities: process.env.LOREM,
    cl: process.env.LOREM,
    clRequired: process.env.LOREM,
    currentCl: process.env.LOREM,
    exp: process.env.LOREM,
    savageRequired: process.env.LOREM,
    team: "Carbuncle"
    })
    Applicant.create({
      name: "Laurent",
      birthday: "1995-06-26",
      discord: "Rabyte#9615",
      mic: false,
      availability: process.env.LOREM,
      about: "Test",
      character: "Rabyte Tsukisagi",
      characterId: 12177390,
      mainClass: process.env.LOREM,
      playtime: process.env.LOREM,
      gameActivities: process.env.LOREM,
      cl: process.env.LOREM,
      clRequired: process.env.LOREM,
      currentCl: process.env.LOREM,
      exp: process.env.LOREM,
      savageRequired: process.env.LOREM,
      team: "Pampa"
      })
})
.catch((error) => console.error(error));

module.exports = { Applicant, Team, User, Festival, Screenshot, Parameter }
