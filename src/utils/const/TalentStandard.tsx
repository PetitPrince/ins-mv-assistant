import { CARACTERISTIQUE_NAMES } from "./Caracteristiques_names";
import talentsJson from "./talents.json";

interface LoadedTalentJson {
  specialisation: string;
  id: string;
  nom: string;
  caracteristique_associe: string;
  inne: boolean;
  superieur_exotique: string;
  type: string;
}
//@ts-ignore
const talentsJsonCasted: LoadedTalentJson[] = talentsJson;
export interface TalentCollection {
  [key: string]: Talent;
}
export interface Talent {
  name: string;
  id: string;
  associatedChara: CARACTERISTIQUE_NAMES;
  specialisationType: TALENT_SPECIALISATION_TYPE_NAME;
  isInnate: boolean;
  talentType: TALENT_TYPE_NAME;
  superieur_exotique: string;
  pa_depense: number;
  customNameFragment?: string;
}
export enum TALENT_SPECIALISATION_TYPE_NAME {
  SPECIFIQUE = "Spécifique",
  GENERIQUE = "Générique",
  MULTIPLE = "Multiple",
}
export enum TALENT_TYPE_NAME {
  PRINCIPALE = "Principal",
  SECONDAIRE = "Secondaire",
  EXOTIQUE = "Exotique",
}
const jsonToTalent = (json: {
  nom: string;
  caracteristique_associe: string;
  specialisation: string;
  inne: boolean;
  type: string;
  id: string;
  superieur_exotique: string;
}) => {
  let assoc_cara;
  switch (json.caracteristique_associe) {
    case CARACTERISTIQUE_NAMES.FORCE:
      assoc_cara = CARACTERISTIQUE_NAMES.FORCE;
      break;
    case CARACTERISTIQUE_NAMES.AGILITE:
      assoc_cara = CARACTERISTIQUE_NAMES.AGILITE;
      break;
    case CARACTERISTIQUE_NAMES.PERCEPTION:
      assoc_cara = CARACTERISTIQUE_NAMES.PERCEPTION;
      break;
    case CARACTERISTIQUE_NAMES.VOLONTE:
      assoc_cara = CARACTERISTIQUE_NAMES.VOLONTE;
      break;
    case CARACTERISTIQUE_NAMES.PRESENCE:
      assoc_cara = CARACTERISTIQUE_NAMES.PRESENCE;
      break;
    case CARACTERISTIQUE_NAMES.FOI:
      assoc_cara = CARACTERISTIQUE_NAMES.FOI;
      break;
    case CARACTERISTIQUE_NAMES.AUCUNE:
      assoc_cara = CARACTERISTIQUE_NAMES.AUCUNE;
      break;
    default:
      assoc_cara = CARACTERISTIQUE_NAMES.AUCUNE;
      break;
  }
  let spe;
  switch (json.specialisation) {
    case TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE:
      spe = TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE;
      break;
    case TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE:
      spe = TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE;
      break;
    case TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE:
      spe = TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE;
      break;
    default:
      spe = TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE;
      break;
  }
  let talentType;
  switch (json.type) {
    case TALENT_TYPE_NAME.PRINCIPALE:
      talentType = TALENT_TYPE_NAME.PRINCIPALE;
      break;
    case TALENT_TYPE_NAME.SECONDAIRE:
      talentType = TALENT_TYPE_NAME.SECONDAIRE;
      break;
    case TALENT_TYPE_NAME.EXOTIQUE:
      talentType = TALENT_TYPE_NAME.EXOTIQUE;
      break;
    default:
      talentType = TALENT_TYPE_NAME.EXOTIQUE;
      break;
  }

  const newTalent: Talent = {
    name: json.nom,
    id: json.id,
    associatedChara: assoc_cara,
    specialisationType: spe,
    isInnate: json.inne,
    talentType: talentType,
    superieur_exotique: json.superieur_exotique,
    pa_depense: 0,
  };
  return newTalent;
};
export const TOUS_LES_TALENTS2 = talentsJsonCasted.map(jsonToTalent);
export const TALENTS_PRINCIPAUX_STANDARD = TOUS_LES_TALENTS2.filter(
  (talent) => {
    return talent.talentType === TALENT_TYPE_NAME.PRINCIPALE;
  }
);
export const TALENTS_PRINCIPAUX_STANDARD_MAP = new Map(
  TALENTS_PRINCIPAUX_STANDARD.map((t) => [t.id, t])
);

export const TALENTS_PRINCIPAUX_STANDARD_OBJ = Object.fromEntries(
  TALENTS_PRINCIPAUX_STANDARD_MAP.entries()
);

export const TALENTS_SECONDAIRES_STANDARD = TOUS_LES_TALENTS2.filter(
  (talent) => {
    return talent.talentType === TALENT_TYPE_NAME.SECONDAIRE;
  }
);
export const TALENTS_SECONDAIRES_STANDARD_MAP = new Map(
  TALENTS_SECONDAIRES_STANDARD.map((t) => [t.id, t])
);

export const TALENTS_SECONDAIRES_STANDARD_OBJ = Object.fromEntries(
  TALENTS_SECONDAIRES_STANDARD_MAP.entries()
);

export const TALENTS_EXOTIQUES_STANDARD = TOUS_LES_TALENTS2.filter((talent) => {
  return talent.talentType === TALENT_TYPE_NAME.EXOTIQUE;
});
export const TALENTS_EXOTIQUES_STANDARD_MAP = new Map(
  TALENTS_EXOTIQUES_STANDARD.map((t) => [t.id, t])
);

export const TALENTS_EXOTIQUES_STANDARD_OBJ = Object.fromEntries(
  TALENTS_EXOTIQUES_STANDARD_MAP.entries()
);
