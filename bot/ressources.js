const discordRoles = {
  officier: '674204890054131712',
  test: '932934305552941066'
}

const roles = {
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
  event: [
    roles.tank.emoji, roles.healer.emoji, roles.melee_dps.emoji,
    roles.physical_ranged_dps.emoji, roles.magic_ranged_dps.emoji,
    '<:Dispo_si_besoin:933068148360487023>',
    '<:Maybe:933068124037709854>',
    '<:Pas_dispo:933068138550018108>',
    '<:Rappel_par_MP:936367117597552721>'
  ],
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
  ]
}

module.exports = { discordRoles, roles, states, emojis };
