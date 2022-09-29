import { FACTIONS_NAMES } from "./Factions";
import { PouvoirCollection } from "./Pouvoir";
import {Talent} from "../const/TalentStandard"

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
  pp_pa_depense: number;
  talents: {
    principaux: Talent[];
    secondaires: Talent[];
    exotiques: Talent[];
  };

  pouvoirs: PouvoirCollection;
}
