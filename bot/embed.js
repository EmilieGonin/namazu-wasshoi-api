const embed = {
  color: "#e62e39",
  title: "Test"
}

const event = {
  fields: [
    { name: '** **', value: '** **' },
    { name: ':calendar: Date', value: '`date`', inline: true },
    { name: ':clock1: Heure de départ', value: '`hour`', inline: true },
    { name: '** **', value: '** **', inline: true },
    { name: '** **', value: '<:Tank:674261754225754152> **Tanks**', inline: true },
    { name: '** **', value: '<:Healer:674261739239637003> **Healers**', inline: true },
    { name: '** **', value: '<:DPS:674261714870468610> **DPS**', inline: true },
    { name: '** **', value: '** **' },
  ],
  footer: {
    text: 'Consultez les messages épinglés pour obtenir de l\'aide.'
  }
}

const activities = {
  cartes: {
    color: "#ffd700",
    title: "🔹Cartes aux trésors",
    description: "Essayez de récupérer votre carte journalière, ou au moins d'en apporter une.",
    // thumbnail: {
    //   url: "https://i.goopics.net/fc2ntk.png"
    // },
    image: {
      url: "attachment://cartes.png"
    }
  },
  atelier: {
    color: "#ffd700",
    title: "🔹Cartes aux trésors",
    description: "Essayez de récupérer votre carte journalière, ou au moins d'en apporter une.",
    // thumbnail: {
    //   url: "https://i.goopics.net/fc2ntk.png"
    // },
    image: {
      url: "attachment://cartes.png"
    }
  },
}

module.exports = { embed, event, activities };
