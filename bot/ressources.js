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
    name: 'DPS mêlée', emoji: '<:Melee_DPS:933062571836182548>'
  },
  physical_ranged_dps: {
    name: 'DPS distants',
    emoji: '<:Physical_Ranged_DPS:933062582326136872>'
  },
  magic_ranged_dps: {
    name: 'DPS magiques',
    emoji: '<:Magic_Ranged_DPS:933062594158276659>'
  }
}

const states = {
  dispo_si_besoin: {
    name: 'Si besoin',
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
    sing: '<:ShoiSing:1014591930526617740>',
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
  inscrits: '<:Inscrits:933695822028226601>',
  inventory: [
    '◀️', '▶️'
  ]
}

const activities = {
  categories: [
    { name: 'Clear et farm', emoji: '<:farm:938081526346842153>' },
    { name: 'Autres', emoji: '<:autres:938078545178148884>' }
  ],
  cartes: {
    category: 'Autres',
    color: 0xffd700,
    title: "<:cartes_aux_tresors:937406414954057768> Cartes aux trésors",
    description: "Venez vous faire un max de gils ! Essayez de récupérer votre carte journalière, ou au moins d'en apporter une.",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/cartes_otush3.png" }
  },
  farm_mount: {
    category: 'Clear et farm',
    subtitle: 'Contenu de la sortie',
    color: 0x7b3890,
    title: '<:farm:938081526346842153> Farm de monture',
    description: 'Essayez de regarder un guide avant de venir, même si le contenu est "vieux". Vous pouvez visionner les vidéos de Mikoto ou Plava, par exemple.',
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643843222/Gyoshoi/farm_mount_lodsab.png" }
  },
  leveling: {
    category: 'Clear et farm',
    color: 0xe3a6f1,
    title: '<:fate:938078284984512583> Session leveling',
    description: "Nous irons faire des roulettes, puis l'un des contenus permettant de gagner de l'expérience rapidement : donjons, aléas, bozja/zadnor.",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1646217035/Gyoshoi/2022-01-05_16-10-52-503_Neneko_Aki_vkinlc.png" }
  },
  apero: {
    category: 'Autres',
    yesno: true,
    color: 0xde7fa2,
    title: '<:jeux:938101995225636894> Soirée apéro/FFXIV',
    description: "Nous vous donnons rendez-vous en vocal et sur Final Fantasy XIV pour une soirée chill en votre compagnie !\n\nNous ferons du contenu FFXIV sans prise de tête (roulettes, raids en alliance, aléas, au choix !) tout en discutant sur Discord. Ceux qui le souhaitent pourront être présents en visio ! Nous en profiterons pour faire les présentations si des nouveaux namazu nous rejoignent. Pour immortaliser la soirée, nous ferons sans doute quelques screenshots tous ensemble !\n\n*Les boissons sont bien entendu optionnelles - consommez avec modération !*",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1646748215/Gyoshoi/2020-08-21_15-32-26_Maya_Celestia_Up_tfjnmp.png" }
  },
  event: {
    category: 'Autres',
    yesno: true,
    color: 0xe62e39,
    subtitle: ':small_blue_diamond:Titre de l\'évent',
    title: '<:event:938751365453320202> EVENT',
    description: "**__Êtes-vous prêts pour le prochain évent de la WasshoCup ?__**",
    fields: [
      { name: ":small_blue_diamond:Description de l'évent", noName: true },
      { name: ":small_blue_diamond:Règles de l'évent", value: "**Vous souhaitez vous préparer à l'avance ?**\n\n__Un peu avant le début de l'évent, vous pouvez :__\n", noName: true },
      { value: "Nous ferons le point sur les règles au début de l'évent. Nous espérons vous voir nombreux ! <:ShoiJoy:893475411495886848>" }
    ]
  },
  jeux: {
    category: 'Autres',
    yesno: true,
    subtitle: 'Jeu de la soirée',
    color: 0x000000,
    title: '<:jeux:938101995225636894> Soirée jeux',
    description: "Venez passez une soirée chill entre namazu !\n\nCeux qui le souhaitent pourront afficher leur partie en stream sur Discord, pour que les personnes ne souhaitant pas spécialement jouer puissent tout de même venir et participer à la soirée en tant que spectateur. " + emojis.shoi.kawaii,
    // image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1643841671/Gyoshoi/2022-01-28_21-42-36-465_Talim_-_Aladdin.png" }
  },
  liveletter: {
    category: 'Autres',
    yesno: true,
    color: 0xbabfc5,
    title: '<:event:938751365453320202> Liveletter',
    description: "Venez assister à la Liveletter entre namazu, que ce soit en direct ou en rediffusion !",
    image: { url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1646215634/Gyoshoi/liveletter_custom_npzasg.png" }
  }
}

const rarities = [
  {
    name: "Légendaire",
    emoji: '<:legendaire:940610155085717504>',
    color: 0xff8000,
    icon: 'https://i.goopics.net/18iyan.png'
  },
  {
    name: "Epique",
    emoji: '<:epique:940611836636700673>',
    color: 0xA335EE,
    icon: 'https://i.goopics.net/dv1ap3.png'
  },
  {
    name: "Rare",
    emoji: '<:rare:940611837186175028>',
    color: 0x5290c1,
    icon: 'https://i.goopics.net/trn39v.png'
  },
  {
    name: "Inhabituelle",
    emoji: '<:inhabituelle:940611836980650034>',
    color: 0x4bb062,
    icon: 'https://i.goopics.net/hq3ttr.png'
  },
  {
    name: "Commune",
    emoji: '<:commune:940611836976447499>',
    color: 0x585954,
    icon: 'https://i.goopics.net/jtv9tu.png'
  }
];

module.exports = { guild, link, discordRoles, roles, states, emojis, activities, rarities };
