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
    { name: '** **', value: '<:Tank:933062548046106665> **Tanks** (0)', inline: true },
    { name: '** **', value: '<:Healer:933062562076057671> **Healers** (0)', inline: true },
    { name: '** **', value: '<:Melee_DPS:933062571836182548> **DPS de mêlée** (0)', inline: true },
    { name: '** **', value: '<:Physical_Ranged_DPS:933062582326136872> **DPS à distance physiques** (0)', inline: true },
    { name: '** **', value: '<:Magic_Ranged_DPS:933062594158276659> **DPS à distance magiques** (0)', inline: true },
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
