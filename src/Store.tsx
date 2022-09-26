import { FACTIONS } from './myConst';
import create from 'zustand';
import produce from "immer";
import { BillingItem } from './Billing';
import { CARACTERISTIQUES, findStandardTalentById, ICaracteristiquesSet2, TalentExistant, TalentsCollection } from './App';

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
  talents: {
    principaux: TalentsCollection
    secondaires: TalentsCollection,
    exotiques: TalentsCollection,
  }
}

export const getCaracteristiqueLevel = (perso:Personnage, caraName?:string) =>{
  const caraPaDepense =caraName ? perso.caracteristiques[caraName].pa_depense : 0;
  return 2 + Math.floor(10 * (caraPaDepense / 4) / 5) * 5 / 10
}
export const getTalentLevel = (perso: Personnage, talentId: string) =>{
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

}>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,

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
