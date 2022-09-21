export enum FACTIONS {
  ANGES = "Anges",
  DEMONS = "Démons",
  TROISIEME_FORCE = "Troisième force",
  AUTRE = "Autres",
}

export enum CARACTERISTIQUES {
  FORCE = "force",
  AGILITE = "agilite",
  PERCEPTION = "perception",
  VOLONTE = "volonte",
  PRESENCE = "presence",
  FOI = "foi"
}

export const SUPERIEURS_ANGES = [
  "Alain, archange des cultures",
  "Blandine, archange des rêves",
  "Christophe, archanges des enfants",
  "Daniel, archange de la pierre",
  "Didier, archange de la communication",
  "Dominique, archange de la justice",
  "Francis, archange de la diplomatie",
  "Guy, archange des guérisseurs",
  "Jean, archange de la foudre",
  "Jean-Luc, archange des protecteurs",
  "Jordi, archange des animaux",
  "Joseph, archange de l'inquisition",
  "Laurent, archange de l'épée",
  "Marc, archange des échanges",
  "Mathias, archange du double jeu",
  "Michel, archange de la guerre",
  "Novalis, archange des fleurs",
  "Walther, archange des exorcistes",
  "Yves, archange des sources"
]
export const SUPERIEURS_DEMONS = [
  "Abalam, prince de la folie",
  "Andrealphus, prince du sexe",
  "Andromalius, prince du jugement",
  "Asmodée, prince du jeu",
  "Baal, prince de la guerre",
  "Baalberith, prince des messagers",
  "Beleth, prince des cauchemars",
  "Belial, prince du feu",
  "Bifrons, prince des morts",
  "Caym, prince des animaux",
  "Corocell, prince du froid",
  "Furfur, prince du hardcore",
  "Gaziel, prince de la terre",
  "Haagenti, prince de la gourmandise",
  "Kobal, prince de l'humour noir",
  "Kronos, prince de l'éternité",
  "Malphas, prince de la discorde",
  "Malthus, prince des maladies",
  "Mammon, prince de la cupidité",
  "Morax, prince des dons artistiques",
  "Nisroch, prince des drogues",
  "Nox, prince de la paresse",
  "Nybbas, prince des médias",
  "Ouikka, prince des airs",
  "Samigina, prince de vampires",
  "Scox, prince des âmes",
  "Shaytan, prince de la laideur",
  "Uphir, prince de la pollution",
  "Valefor, prince des voleurs",
  "Vapula, prince de la technologie",
  "Vephar, prince des océans"
]

export const talentsExotiquesParDefaut = [
  {
    "specialisation": "Générique",
    "nom": "Contorsionisme",
    "caracteristique_associe": "Agilité",
    "inne": false,
    "superieur_exotique": "Christophe, Janus, Kobal, Valefor",
    "type": "Exotique"
  },


  {
    "specialisation": "Générique",
    "nom": "Humour",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "Christophe, Haagenti, Kobal",
    "type": "Exotique"
  },
  {
    "specialisation": "Générique",
    "nom": "Hypnotisme",
    "caracteristique_associe": "Volonté",
    "inne": false,
    "superieur_exotique": "Joseph, Walther, Abalam, Nog, Scox",
    "type": "Exotique"
  },



  {
    "specialisation": "Générique",
    "nom": "Jeu",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "Asmodée",
    "type": "Exotique"
  },
  {
    "specialisation": "Générique",
    "nom": "Kama sutra",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "Andrealphus",
    "type": "Exotique"
  },
  {
    "specialisation": "Générique",
    "nom": "Language animal",
    "caracteristique_associe": "Perception",
    "inne": false,
    "superieur_exotique": "Jordi, Novalis, Caym",
    "type": "Exotique"
  },



  {
    "specialisation": "Générique",
    "nom": "Narcolepsie",
    "caracteristique_associe": "Volonté",
    "inne": false,
    "superieur_exotique": "Blandine, Beleth, Nog",
    "type": "Exotique"
  },

  {
    "specialisation": "Générique",
    "nom": "Pickpocket",
    "caracteristique_associe": "Agilité",
    "inne": false,
    "superieur_exotique": "Janus, Valefor",
    "type": "Exotique"
  },

  {
    "specialisation": "Générique",
    "nom": "Prestedigitation",
    "caracteristique_associe": "Agilité",
    "inne": false,
    "superieur_exotique": "Christophe, Janus, Valefor",
    "type": "Exotique"
  },


  {
    "specialisation": "Générique",
    "nom": "Sixième sens",
    "caracteristique_associe": "Chance / Foi",
    "inne": false,
    "superieur_exotique": "Dominique, Andromalius",
    "type": "Exotique"
  },

  {
    "specialisation": "Générique",
    "nom": "Torture",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "Joseph",
    "type": "Exotique"
  },
  {
    "specialisation": "Générique",
    "nom": "Ventriloquie",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "Christophe",
    "type": "Exotique"
  }
];

export const talentsSecondairesParDefaut = [
  {
    "specialisation": "Générique",
    "nom": "Acrobatie",
    "caracteristique_associe": "Agilité",
    "inne": true,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Aisance sociale",
    "caracteristique_associe": "Présence",
    "inne": true,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Art",
    "caracteristique_associe": "Présence",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Athlétisme",
    "caracteristique_associe": "Force",
    "inne": true,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Conduite",
    "caracteristique_associe": "Agilité",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Culture générale",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Multiple",
    "nom": "Hobby",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Informatique",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Intimidation",
    "caracteristique_associe": "Force",
    "inne": true,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Multiple",
    "nom": "Langues",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Multiple",
    "nom": "Métier",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Navigation",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Générique",
    "nom": "Pilotage",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Savoir criminel",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Savoir d’espion",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Savoir militaire",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Savoir occulte",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Science",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Survie",
    "caracteristique_associe": "Perception",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Technique",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Secondaire"
  },
]

export const talentsPrincipauxParDefaut = [
  {
    "specialisation": "Générique",
    "nom": "Baratin",
    "caracteristique_associe": "Présence",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Spécifique",
    "nom": "Combat",
    "caracteristique_associe": "Agilité",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Corps à corps",
    "caracteristique_associe": "Agilité",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },

  {
    "specialisation": "Générique",
    "nom": "Défense",
    "caracteristique_associe": "Agilité",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Discrétion",
    "caracteristique_associe": "Agilité",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Discussion",
    "caracteristique_associe": "Volonté",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Enquête",
    "caracteristique_associe": "Chance / Foi",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Fouille",
    "caracteristique_associe": "Perception",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Intrusion",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Médecine",
    "caracteristique_associe": "Aucune",
    "inne": false,
    "superieur_exotique": "",
    "type": "Principal"
  },
  {
    "specialisation": "Générique",
    "nom": "Séduction",
    "caracteristique_associe": "Présence",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },

  {
    "specialisation": "Spécifique",
    "nom": "Tir",
    "caracteristique_associe": "Perception",
    "inne": true,
    "superieur_exotique": "",
    "type": "Principal"
  },
]
