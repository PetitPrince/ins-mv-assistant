<p align="center">
  <img src="public/logo-192.png" />
</p>

# INS/MV Assistant

[Live version here](https://petitprince.github.io/ins-mv-assistant/).

Offline-first assistant for the French pen-and-paper role playing game "In Nomine Satanis / Magna Veritas", 4th edition. The rest of the readme is French, because this is, after all, a French RPG

---

[Version en ligne ici](https://petitprince.github.io/ins-mv-assistant/).

Assistant pour le jeu de rôle "In Nomine Satanis / Magna Veritas" (INS/MV), 4ème édition. Sauve les données seulement sur votre navigateur et/ou sur votre machine locale, au grand dam de Monseigneur Didier et Monseigneur Baalberith.

## On peut faire quoi ? [features]

- Mode création: générer une fiche de personnage suivant les règles de la 4ème édition, avec un contrôle des restrictions de création (pas besoin de chercher sur trois chapitres différents les limites de PA)
- Mode update: gérer l'évolution d'un personnage-joueur au fil d'une campagne
- Mode aventure: avoir un accès rapide aux talents, caractéristiques, etc... accessibles par le personnage. Gestion des PF, PP pour éviter d'avoir une région dévastée par la gomme sur sa fiche de perso.

## J'aimerais bien faire ça dans le future [roadmap]

- Assistant de combat: calcul automatique des bonus de base; il ne resterait plus que jeter le d666 et communiuquer le résultat au MJ.
- Création rapide personnage pour le MJ, en suivant des archetypes

## Pourquoi pas l'édition 3 et/ou l'édition Apéro ?

Parce que notre groupe de joueurs avons commencé avec la 4ème édition, et migrer vers une autre version bousculerait trop nos habitudes. De plus, les règles tarabiscotées de la 4ème édition se prêtent bien à un exercice de programmation.

## Tech stack

- [React](reactjs.org/) et Typescript parce que le but de l'exercice était d'apprendre React
- [Create React App](https://create-react-app.dev/) parce qu'il faut bien commencer quelque part
- [Mantine](https://mantine.dev/) pour des composants pas trop mal
- [Zustand](https://github.com/pmndrs/zustand) comme Store
- [Immer](https://github.com/immerjs/immer) pour simplifier l'écriture dans le Store
