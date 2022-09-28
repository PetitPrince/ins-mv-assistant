import { TalentDisplayRow } from "../../components/talents/Talents";
import { FACTIONS_NAMES } from "./Factions";
import { PouvoirCollection } from "./Pouvoir";

export interface TalentInvesti {
  pa_depense: number;
  niveau: number;
  customNameFragment?: string;
}
export interface TalentInvestiCollection {
  [key: string]: TalentInvesti;
}
export interface TalentInvestiExotiqueCollection {
  [key: string]: TalentDisplayRow;
}

export interface Caracteristique {
  // niveau: number,
  pa_depense: number;
}
export interface CaracteristiquesSet {
  [index: string]: Caracteristique;
  force: Caracteristique;
  agilite: Caracteristique;
  perception: Caracteristique;
  volonte: Caracteristique;
  presence: Caracteristique;
  foi: Caracteristique;
}

export interface Personnage {
  identite: string;
  faction: FACTIONS_NAMES;
  superieur: string; // todo: enum
  grade: number;
  caracteristiques: CaracteristiquesSet;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;
  talents: {
    principaux: TalentInvestiCollection;
    secondaires: TalentInvestiCollection;
    exotiques: TalentInvestiExotiqueCollection;
  };
  pouvoirs: PouvoirCollection;
}
