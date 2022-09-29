import { FACTIONS_NAMES } from "./Factions";
import { PouvoirCollection } from "./Pouvoir";
import {Talent2} from "../const/TalentStandard"

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
  talents2: {
    principaux: Talent2[];
    secondaires: Talent2[];
    exotiques: Talent2[];
  };

  pouvoirs: PouvoirCollection;
}
