import { FACTIONS } from './myConst';
import create from 'zustand';
import produce from "immer";
import { BillingItem, calcBillingItemSum, generateBillingItems } from './Billing';
import { Personnage, CARACTERISTIQUES, TalentExistant } from './App';

// any operation in the app is done on the Personnage, and the billing sort out the rest
export const emptyPerso: Personnage = {
  identite: "",
  faction: FACTIONS.AUTRE,
  superieur: "",
  grade: 0,
  caracteristiques: {
    force:{
      niveau: 2,
      pa_depense: 0
    },
    agilite:{
      niveau: 2,
      pa_depense: 0
    },
    perception:{
      niveau: 2,
      pa_depense: 0
    },
    volonte:{
      niveau: 2,
      pa_depense: 0
    },
    presence:{
      niveau: 2,
      pa_depense: 0
    },
    foi:{
      niveau: 2,
      pa_depense: 0
    },
  },
  pa: 0,
  paTotal: 0,
  pp: 0,
  ppMax: 0,
  freeSecondayTalentPoints: 0,
  talents: {
    principaux: {
      // "combat-specifique": {
      //   niveau: 4,
      //   customNameFragment: "Crayon très aiguisé"
      // },
      // "baratin": {
      //   niveau: 3
      // }
    },
    secondaires: {
      // "aisance-sociale": {
      //   niveau: 3
      // },
      // "hobby-dressage-de-bouquetin": {
      //   customNameFragment: "Dressage de bouquetin",
      //   niveau: 4
      // }
    },
    exotiques: {}
  }

};

export const useStore = create<{
  currentPerso: Personnage;
  originalPerso: Personnage;
  billingItems: BillingItem[];
  paAfterBilling: number;

  setPerso: (val: Personnage) => void;
  setOriginalPerso: (val: Personnage) => void;
  setCurrentIdentite: (val: string) => void;
  setCurrentFaction: (val: FACTIONS) => void;
  setCurrentGrade: (val: number) => void;
  setCurrentSuperieur: (val: string) => void;
  setCurrentCaracteristiques: (val: number, caracteristique: CARACTERISTIQUES) => void;
  setCurrentPa: (val: number) => void;
  setCurrentPaTotal: (val: number) => void;
  setCurrentPp: (val: number) => void;
  setCurrentPpMax: (val: number) => void;
  setCurrentFreeTalentPoints: (val: number) => void;
  setCurrentTalentPrincipal: (talentId: string, val: TalentExistant) => void;
  setCurrentTalentSecondaire: (talentId: string, val: TalentExistant) => void;
  updateBilling: (originalPerso: Personnage, draftPerso: Personnage) => void;
}>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,
  freeTalentPoints: 0,

  updateBilling: (originalPerso, draftPerso) => {
    const updatedBillingItems = generateBillingItems(originalPerso, draftPerso);

    // Calc the points that ca nbe freely spent on secondary talent
    // Rule is 1 point bought (primary or secondary) = 1 point freely spent on secondary

    // Initial state is whatever was left non spent (in case we're in the middle of creating a character)
    let updatedFreeSecondaryTalentPoints = originalPerso.freeSecondayTalentPoints;

    // Add whatever points spent on Talent Principaux
    const updatesOnTalentsPrincipaux = updatedBillingItems.filter(billingItem => billingItem.key.startsWith("/talents/principaux"));
    for (const updateOnTalentsPrincipaux of updatesOnTalentsPrincipaux) {
      if (updateOnTalentsPrincipaux.cost != null && updateOnTalentsPrincipaux.cost != NaN) {
        updatedFreeSecondaryTalentPoints += updateOnTalentsPrincipaux.cost;
      }
    }

    //
    const secondaryBills = updatedBillingItems.filter(x => x.key.includes("secondaires"));
    if (secondaryBills.length > 0
      && updatedFreeSecondaryTalentPoints > 0) {
      const totalCostSecondaryBills = secondaryBills.map(x => x.cost ? x.cost : 0).reduce((sum, val) => { return sum + val; }, 0);
      const remainingFreePoints = updatedFreeSecondaryTalentPoints - totalCostSecondaryBills;
      const remainingFreePointsDisplay = remainingFreePoints < 0 ? 0 : remainingFreePoints;
      const deduction = remainingFreePoints <= 0 ? updatedFreeSecondaryTalentPoints : remainingFreePoints;
      const msg = updatedFreeSecondaryTalentPoints + " rangs offert par les dépenses dans les talents principaux (reste:" + remainingFreePointsDisplay + ")";
      updatedBillingItems.push({
        key: "freeTalentPoints",
        msg: msg,
        cost: -deduction,
      });
    }


    // // Add whatever points spent on Talent secondaires ... but only those not using the free pool (i.e. have to be calc after ?)
    // MEGA TODO: consider a Personnage not a collection of stat, but rather as a collection PA spent on that stat. In other words,
    // the level of everything is a secondary by product of the PA billing
    // const updatesOnTalentsSecondaires = updatedBillingItems.filter(billingItem => billingItem.key.startsWith("/talents/secondaires"));
    // for (const updateOnTalentsSecondaires of updatesOnTalentsSecondaires) {
    //   if (updateOnTalentsSecondaires.cost != null && updateOnTalentsSecondaires.cost != NaN) {
    //     updatedFreeSecondaryTalentPoints += updateOnTalentsSecondaires.cost;
    //   }
    // }

    set(produce(draftState => {
      draftState.billingItems = updatedBillingItems;
      draftState.currentPerso.freeTalentPoints = updatedFreeSecondaryTalentPoints;
      draftState.paAfterBilling = get().currentPerso.pa - calcBillingItemSum(updatedBillingItems);
    }
    ));
  },
  setPerso: (val) => {
    set(produce(draftState => { draftState.currentPerso = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setOriginalPerso: (val) => {
    set(produce(draftState => { draftState.originalPerso = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentIdentite: (val) => {
    set(produce(draftState => { draftState.currentPerso.identite = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentFaction: (val) => {
    set(produce(draftState => { draftState.currentPerso.faction = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentGrade: (val) => {
    set(produce(draftState => { draftState.currentPerso.grade = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentSuperieur: (val) => {
    set(produce(draftState => { draftState.currentPerso.superieur = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentCaracteristiques: (val, cara) => {
    set(produce(draftState => { draftState.currentPerso.caracteristiques[cara] = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);

  },
  setCurrentPa: (val) => {
    set(produce(draftState => { draftState.currentPerso.pa = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentPaTotal: (val) => {
    set(produce(draftState => { draftState.currentPerso.paTotal = val; }));
  },
  setCurrentPp: (val) => {
    set(produce(draftState => { draftState.currentPerso.pp = val; }));
  },
  setCurrentPpMax: (val) => {
    set(produce(draftState => { draftState.currentPerso.ppMax = val; }));
  },
  setCurrentFreeTalentPoints: (val) => {
    set(produce(draftState => { draftState.currentPerso.freeTalentPoints = val; }));
  },
  setCurrentTalentPrincipal(talentId, val) {
    set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId] = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentTalentSecondaire(talentId, val) {
    set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId] = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  }
}));
