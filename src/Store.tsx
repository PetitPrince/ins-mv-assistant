import { FACTIONS } from './myConst';
import create from 'zustand';
import produce from "immer";
import { BillingItem, calcBillingItemSum, generateBillingItems, generateBillingItems2 } from './Billing';
import { CARACTERISTIQUES, findStandardTalentById, ICaracteristiquesSet2, TalentExistant, TalentsCollection, TALENTS_PRINCIPAUX_STANDARD, TOUS_LES_TALENTS } from './App';

export interface Personnage {
  identite: string;
  faction: FACTIONS;
  superieur: string; // todo: enum
  grade: number;
  caracteristiques: ICaracteristiquesSet2;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;
  freeSecondayTalentPoints: number;
  talents: {
    principaux: TalentsCollection
    secondaires: TalentsCollection,
    exotiques: TalentsCollection,
  }
}
export class PersonnageX {
  identite: string;
  faction: FACTIONS;
  superieur: string; // todo: enum
  grade: number;
  caracteristiques: ICaracteristiquesSet2;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;
  freeSecondayTalentPoints: number;
  talents: {
    principaux: TalentsCollection
    secondaires: TalentsCollection,
    exotiques: TalentsCollection,
  }
  // TODO: talents, pouvoirs

  constructor( dictLike:{
    identite: string,
    faction: FACTIONS,
    superieur: string, // todo: enum
    grade: number,
    caracteristiques: ICaracteristiquesSet2,
    pa: number,
    paTotal: number,
    pp: number,
    ppMax: number,
    freeSecondayTalentPoints: number,
    talents: {
      principaux: TalentsCollection
      secondaires: TalentsCollection,
      exotiques: TalentsCollection,
    }
  }){
    const {identite, faction, superieur, grade, caracteristiques, pa, paTotal, pp, ppMax, freeSecondayTalentPoints, talents} = dictLike;
    this.identite=identite;
    this.faction = faction;
    this.superieur = superieur;
    this.grade = grade;
    this.caracteristiques = caracteristiques;
    this.pa = pa;
    this.paTotal = paTotal;
    this.pp = pp;
    this.ppMax = ppMax;
    this.freeSecondayTalentPoints = freeSecondayTalentPoints;
    this.talents = talents
  }

  getCaracteristiqueLevel(caraName:string){ // TODO: should ensure caraname be an index of caracteristique
    const caraPaDepense = this.caracteristiques[caraName].pa_depense;
    return 2 + Math.floor(10 * (caraPaDepense / 4) / 5) * 5 / 10
  }
  getTalentLevel(talentId: string){
    // todo: should ensure talent exists
    let existingTalent;

    if (Object.hasOwn(this.talents.principaux, talentId)){
      existingTalent = this.talents.principaux[talentId];
    }else if(Object.hasOwn(this.talents.principaux, talentId)){
      existingTalent = this.talents.secondaires[talentId];
    }else{
      existingTalent = {pa_depense: 0}
    }

    let associatedCara = findStandardTalentById(talentId)?.associatedChara;

    let levelFromAssociatedChara = 0;
    if(associatedCara){
      levelFromAssociatedChara = this.getCaracteristiqueLevel(associatedCara);
    }

    const levelFromPa = existingTalent.pa_depense/2;

    return levelFromPa + levelFromAssociatedChara

  }
}
export function getCaracteristiqueLevel(perso:Personnage, caraName?:string){
  const caraPaDepense =caraName ? perso.caracteristiques[caraName].pa_depense : 0;
  return 2 + Math.floor(10 * (caraPaDepense / 4) / 5) * 5 / 10
}
export function getTalentLevel(perso: Personnage, talentId: string){
  let existingTalent;

  if (Object.hasOwn(perso.talents.principaux, talentId)){
    existingTalent = perso.talents.principaux[talentId];
  }else if(Object.hasOwn(perso.talents.secondaires, talentId)){
    existingTalent = perso.talents.secondaires[talentId];
  }else if(Object.hasOwn(perso.talents.exotiques, talentId)){
    existingTalent = perso.talents.secondaires[talentId];
  }else{
    existingTalent = {pa_depense: 0}
  }

  let associatedCara = findStandardTalentById(talentId)?.associatedChara;

  let levelFromAssociatedChara = 0;
  if(associatedCara !== "Aucune"){
    levelFromAssociatedChara = getCaracteristiqueLevel(perso, associatedCara)/2;
  }

  const levelFromPa = existingTalent.pa_depense/2;
  return levelFromPa + levelFromAssociatedChara

}

// any operation in the app is done on the Personnage, and the billing sort out the rest
const emptyPersoDict = {
    identite: "",
  faction: FACTIONS.AUTRE,
  superieur: "",
  grade: 0,
  caracteristiques: {
    force:{
      pa_depense: 0
    },
    agilite:{
      pa_depense: 0
    },
    perception:{
      pa_depense: 0
    },
    volonte:{
      pa_depense: 0
    },
    presence:{
      pa_depense: 0
    },
    foi:{
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
// export const emptyPerso = new Personnage(emptyPersoDict);
export const emptyPerso = emptyPersoDict;

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
  setCurrentCaracteristiquesPaDepense: (val: number, caracteristique: CARACTERISTIQUES) => void;
  setCurrentPa: (val: number) => void;
  setCurrentPaTotal: (val: number) => void;
  setCurrentPp: (val: number) => void;
  setCurrentPpMax: (val: number) => void;
  setCurrentFreeTalentPoints: (val: number) => void;
  setCurrentTalentPrincipal: (talentId: string, val: TalentExistant) => void;
  setCurrentTalentPrincipalPaDepense: (talentId: string, val: number) => void;
  setCurrentTalentPrincipalNameFragment: (talentId: string, val: string) => void;
  setCurrentTalentSecondaire: (talentId: string, val: TalentExistant) => void;
  setCurrentTalentSecondairePaDepense: (talentId: string, val: number) => void;
  setCurrentTalentSecondaireNameFragment: (talentId: string, val: string) => void;
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
  },
  setOriginalPerso: (val) => {
    set(produce(draftState => { draftState.originalPerso = val; }));
  },
  setCurrentIdentite: (val) => {
    set(produce(draftState => { draftState.currentPerso.identite = val; }));
  },
  setCurrentFaction: (val) => {
    console.log(val);
    set(produce(draftState => { draftState.currentPerso.faction = val; }));
  },
  setCurrentGrade: (val) => {
    set(produce(draftState => { draftState.currentPerso.grade = val; }));
  },
  setCurrentSuperieur: (val) => {
    set(produce(draftState => { draftState.currentPerso.superieur = val; }));
  },
  setCurrentCaracteristiques: (val, cara) => {
    set(produce(draftState => { draftState.currentPerso.caracteristiques[cara] = val; }));
  },
  setCurrentCaracteristiquesPaDepense: (val, cara) => {
    set(produce(draftState => { draftState.currentPerso.caracteristiques[cara].pa_depense = val; }));
  },

  setCurrentPa: (val) => {
    set(produce(draftState => { draftState.currentPerso.pa = val; }));
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
  },
    setCurrentTalentPrincipalPaDepense(talentId, val) {
    const hasTalent = Object.keys(get().currentPerso.talents.principaux).includes(talentId);
    if(hasTalent){
      set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId].pa_depense = val; }));
    }else{
      const newTalent = {
        pa_depense: val,
        nivea: 1
      }
      set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId] = newTalent; }));
    }
  },

  setCurrentTalentPrincipalNameFragment(talentId, val) {
    const hasTalent = Object.keys(get().currentPerso.talents.principaux).includes(talentId);
    if(hasTalent){
      set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId].customNameFragment = val; }));
    }else{
      const newTalent = {
        pa_depense: 0,
        nivea: 1,
        customNameFragment: val,
      }
      set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId] = newTalent; }));
    }
  },  
  setCurrentTalentSecondaire(talentId, val) {
    set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId] = val; }));
  },
  setCurrentTalentSecondairePaDepense(talentId, val) {
    const hasTalent = Object.keys(get().currentPerso.talents.secondaires).includes(talentId);
    if(hasTalent){
      set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId].pa_depense = val; }));
    }else{
      const newTalent = {
        pa_depense: val,
        nivea: 1
      }
      set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId] = newTalent; }));
    }
  },

  setCurrentTalentSecondaireNameFragment(talentId, val) {
    const hasTalent = Object.keys(get().currentPerso.talents.secondaires).includes(talentId);
    if(hasTalent){
      set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId].customNameFragment = val; }));
    }else{
      const newTalent = {
        pa_depense: 0,
        nivea: 1,
        customNameFragment: val,
      }
      set(produce(draftState => { draftState.currentPerso.talents.secondaires[talentId] = newTalent; }));
    }
  },  

}));
