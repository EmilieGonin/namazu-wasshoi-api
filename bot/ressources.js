require('dotenv').config();
const env = process.env.NODE_ENV;
const devRole = '932934305552941066';
const devChannel = '938454833353084938';

const guild = env ? '674203369275129857' : '901224403122151474';
const link = 'https://discord.com/channels/' + guild + '/';

const discordRoles = {
  officier: env ? '674204890054131712' : devRole,
  membres: env ? '674206058410934272' : devRole,
  jeunes_membres: env ? '675344539724152843' : devRole,
}

const channels = {
  planning: env ? '894607375271604224' : devChannel,
  inscriptions: env ? '841025816556863509' : devChannel,
  rassemblement: env ? '677984271159263282' : devChannel,
  logs: env ? '707735383177166858' : devChannel
}

const roles = {
  dispo: {
    name: 'Dispo', emoji: '<:Dispo:938411742575349830>'
  },
  tank: {
    name: 'Tanks', emoji: '<:Tank:933062548046106665>'
  },
  healer: {
    name: 'Healers', emoji: '<:Healer:933062562076057671>'
  },
  melee_dps: {
    name: 'DPS de mêlée', emoji: '<:Melee_DPS:933062571836182548>'
  },
  physical_ranged_dps: {
    name: 'DPS à distance physiques',
    emoji: '<:Physical_Ranged_DPS:933062582326136872>'
  },
  magic_ranged_dps: {
    name: 'DPS à distance magiques',
    emoji: '<:Magic_Ranged_DPS:933062594158276659>'
  }
}

const states = {
  dispo_si_besoin: {
    name: 'Dispo si besoin',
    emoji: '<:Dispo_si_besoin:933068148360487023>'
  },
  maybe: {
    name: 'Peut-être',
    emoji: '<:Maybe:933068124037709854>'
  },
  pas_dispo: {
    name: 'Pas dispo',
    emoji: '<:Pas_dispo:933068138550018108>'
  }
}

const emojis = {
  shoi: {
    teams: {
      mog: '<:ShoiMog:893475670724857866>',
      chocobo: '<:ShoiChocobo:893475702710599711>',
      pampa: '<:ShoiPampa:893475738953588777>',
      carbuncle: '<:ShoiCarbuncle:893475770222133258>'
    },
    angel: '<:ShoiAngel:893475807811489894>',
    blbl: '<:ShoiBlbl:893476090725683249>',
    coffee: '<:ShoiCoffee:893475472267165736>',
    cry: '<:ShoiCry:813510411827675237>',
    evil: '<:ShoiEvil:893475846109659136>',
    eyes: '<:ShoiEyes:893475509973954630>',
    fear: '<:ShoiFear:893476198250840074>',
    flex: '<:ShoiFlex:813510412162433064>',
    glasses: '<:ShoiGlasses:813510412418416660>',
    gold: '<:ShoiGold:813510412346720327>',
    grr: '<:ShoiGrr:813510412124684318>',
    gun: '<:ShoiGun:893475600348631051>',
    huhu: '<:ShoiHuhu:893476054449156106>',
    joy: '<:ShoiJoy:893475411495886848>',
    kawaii: '<:ShoiKawaii:893475357951393823>',
    love: '<:ShoiLove:813510412016025601>',
    mdr: '<:ShoiMDR:813510412175278110>',
    pls: '<:ShoiPLS:813510412103843882>',
    party: '<:ShoiParty:813510412187992084>',
    peek: '<:ShoiPeek:893476129535561748>',
    punk: '<:ShoiPunk:893476000510394388>',
    scream: '<:ShoiScream:893476161043169290>',
    sing: '<:ShoiSing:893475635534655529>',
    surprise: '<:ShoiSurprise:893475550549659698>',
    think: '<:ShoiThink:813510412254838865>',
    wave: '<:ShoiWave:813510412007243807>',
    wasshoi: '<:Wasshoi:813510412150505472>'
  },
  event: {
    default: [
      roles.tank.emoji, roles.healer.emoji, roles.melee_dps.emoji,
      roles.physical_ranged_dps.emoji, roles.magic_ranged_dps.emoji,
      '<:Dispo_si_besoin:933068148360487023>',
      '<:Maybe:933068124037709854>',
      '<:Pas_dispo:933068138550018108>',
      '<:Changer_Job:936401518364610571>',
      '<:Rappel_par_MP:936367117597552721>'
    ],
    yesno : [
      '<:Dispo:938411742575349830>',
      '<:Maybe:933068124037709854>',
      '<:Pas_dispo:933068138550018108>',
      '<:Rappel_par_MP:936367117597552721>'
    ]
  },
  tank: [
    '<:pld:934408826394918932>',
    '<:war:934409423806427136>',
    '<:drk:934408826290073681>',
    '<:gnb:934408826118086687>'
  ],
  healer: [
    '<:whm:934408826717868083>',
    '<:sch:934408826529128458>',
    '<:ast:934408826319409172>',
    '<:sge:934408826613022750>'
  ],
  melee_dps: [
    '<:mnk:934408826436870194>',
    '<:drg:934408826298462218>',
    '<:nin:934408826420101130>',
    '<:sam:934408826290049065>',
    '<:rpr:934409365795012650>'
  ],
  physical_ranged_dps: [
    '<:brd:934408826050977864>',
    '<:mch:934408826449457162>',
    '<:dnc:934408825912569877>'
  ],
  magic_ranged_dps: [
    '<:blm:934408826294263819>',
    '<:smn:934408826315231284>',
    '<:rdm:934408826478817341>'
  ],
  error: '<:error:936622863031623700>',
  update: '<:update:936631342857338950>',
  edit: '<:edit:936640835766845521>',
  rappel: '<:Rappel_par_MP:936367117597552721>',
  true: '<:true:937343578714275901>',
  false: '<:false:937343578424873002>',
  inscrits: '<:Inscrits:933695822028226601>'
}

const activities = {
  categories: [
    { name: 'Ateliers', emoji: '<:ateliers:938077848441348117>' },
    { name: 'Clear et farm', emoji: '<:farm:938081526346842153>' },
    { name: 'Autres', emoji: '<:autres:938078545178148884>' }
  ],
  atelier_glam: {
    category: 'Ateliers',
    yesno: true,
    color: '#faaab4',
    title: "<:glamour:938077848336498749> Atelier Glamour avec Yuuna",
    description: 'uc',
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/atelier_glam_tdz0xt.png" }
  },
  atelier_gold: {
    category: 'Ateliers',
    yesno: true,
    color: '#eec671',
    title: "<:gold_saucer:938077848659451909> Atelier Gold Saucer avec Rabyte",
    description: "Viens te plonger dans l'univers magique (et dépensier) du Gold Saucer !\n\nDans cet atelier ouvert à tous, tu pourras apprendre les ficelles du farm de PGS et réaliser ton carnet d'objectifs, que ce soit grâce aux JACTAS ou à la Triple Triade, en passant par la course de Chocobo ! Viens t'amuser et devenir riche *(en PGS)* avec nous ! " + emojis.shoi.gold,
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/atelier_gold_cmeomv.png" }
  },
  atelier_logs: {
    category: 'Ateliers',
    yesno: true,
    color: '#001487',
    title: "<:ateliers:938077848441348117> Atelier Logs avec Ladisla",
    description: "Bienvenue à cette session conçue pour vous aider à approfondir vos connaissances et votre niveau d'expertise sur FFXIV ! Cet atelier abordera de nombreux sujets, que ce soit pour maîtriser votre job ou apprendre à utiliser les outils de logs.",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/atelier_logs_bxd9gu.png" },
    fields: [
      { value: "** **"},
      { name: ':small_blue_diamond:Programme du jour' }
    ]
  },
  atelier_screen: {
    category: 'Ateliers',
    yesno: true,
    color: '#FFFFFF',
    title: "<:screenshots:938075407821983744> Atelier Screenshots avec Nexara",
    description: 'Venez participer à une soirée dynamique GPOSE/screenshots !\n\n**__Rendez-vous devant la maison de CL pour le départ du train.__**',
    fields: [
      { name: "Description", noName: true },
      { value: "** **"},
      { name: ':small_blue_diamond:Thème de glam (optionnel)', inline: true },
      { name: ':small_blue_diamond:Arrêts prévus', inline: true }
    ]
  },
  cartes: {
    category: 'Autres',
    color: '#ffd700',
    title: "<:cartes_aux_tresors:937406414954057768> Cartes aux trésors",
    description: "Venez vous faire un max de gils ! Essayez de récupérer votre carte journalière, ou au moins d'en apporter une.",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/cartes_otush3.png" }
  },
  farm_mount: {
    category: 'Clear et farm',
    subtitle: 'Contenu de la sortie',
    color: '#7b3890',
    title: '<:farm:938081526346842153> Farm de monture',
    description: 'Essayez de regarder les vidéos avant de venir (celles de Mikoto ou Plava par exemple).',
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/farm_mount_lodsab.png" }
  },
  jeux: {
    category: 'Autres',
    yesno: true,
    subtitle: 'Jeu de la soirée',
    color: '#000000',
    title: '<:jeux:938101995225636894> Soirée jeux',
    description: "uc",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643841671/Gyoshoi/2022-01-28_21-42-36-465_Talim_-_Aladdin.png" }
  },
  event: {
    category: 'Autres',
    yesno: true,
    color: "#e62e39",
    subtitle: ':small_blue_diamond:Titre de l\'évent',
    title: '<:event:938751365453320202> EVENT',
    description: "**__Êtes-vous prêts pour le prochain évent de la WasshoCup ?__**",
    fields: [
      { name: ":small_blue_diamond:Description de l'évent", noName: true },
      { name: ":small_blue_diamond:Règles de l'évent", value: "**Vous souhaitez vous préparer à l'avance ?**\n\n__Un peu avant le début de l'évent, vous pouvez :__\n", noName: true },
      { value: "Nous ferons le point sur les règles au début de l'évent. Nous espérons vous voir nombreux ! <:ShoiJoy:893475411495886848>" }
    ]
  }
}

module.exports = { guild, link, discordRoles, channels, roles, states, emojis, activities };
