import { FACTIONS_NAMES } from "./Factions";
import { PouvoirCollection } from "./Pouvoir";
import {TalentCollection} from "../const/TalentStandard"

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
  extraPaTalent: number;
  paTotal: number;
  pp_pa_depense: number;
  talents: {
    principaux: TalentCollection; // TODO: talents have to be stored as a dict to keep the direct access for json patch
    secondaires: TalentCollection;
    exotiques: TalentCollection;
  };
  pouvoirs: PouvoirCollection;
  equipements: EquipementCollection;
  notes: string;
}

export interface Equipement{
  id: string;
  nom: string;
  coutEnPa: number;
}
export interface EquipementCollection {
  [key: string]: Equipement;
}
