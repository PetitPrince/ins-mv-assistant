import talentsJson from "./talents.json";


export class TalentStandard {
  name: string;
  id: string;
  associatedChara: string;
  specialisationType: string;
  isInnate: boolean;
  talentType: string;
  constructor(
    name: string,
    id: string,
    associatedChara: string,
    specialisationType: string,
    isInnate: boolean,
    talentType: string
  ) {
    this.name = name;
    this.id = id;
    this.associatedChara = associatedChara;
    this.specialisationType = specialisationType;
    this.isInnate = isInnate;
    this.talentType = talentType;
  }

  static fromJson(json: {
    nom: string;
    caracteristique_associe: string;
    specialisation: string;
    inne: boolean;
    type: string;
    id: string;
  }) {
    return new TalentStandard(
      json.nom,
      json.id,
      json.caracteristique_associe,
      json.specialisation,
      json.inne,
      json.type
    );
  }
}
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
export const TOUS_LES_TALENTS = talentsJsonCasted.map(TalentStandard.fromJson);
export const findStandardTalentById = (id: string) => {
  return TOUS_LES_TALENTS.find((x) => x.id === id);
};
export const TALENTS_PRINCIPAUX_STANDARD = TOUS_LES_TALENTS.filter((talent) => {
  return talent.talentType === "Principal";
});
export const TALENTS_SECONDAIRES_STANDARD = TOUS_LES_TALENTS.filter(
  (talent) => {
    return talent.talentType === "Secondaire";
  }
);
