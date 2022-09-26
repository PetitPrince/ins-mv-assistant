import './App.css';
import { MantineProvider, NumberInputProps } from '@mantine/core';
import { NumberInput, Stack } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import { FACTIONS } from './myConst';
import { } from "immer"
import { enablePatches } from "immer"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { NotificationsProvider } from '@mantine/notifications';
import { BillingPanel } from './Billing';
import { Status } from './Status';
import { Caracteristiques } from './Caracteristiques';
import { Generalites } from './Generalites';
import talentsJson from './talents.json';
import { useStore } from './Store';
import { Talents } from './Talents';

enablePatches()

export enum CARACTERISTIQUES {
  FORCE = "force",
  AGILITE = "agilite",
  PERCEPTION = "perception",
  VOLONTE = "volonte",
  PRESENCE = "presence",
  FOI = "foi"
}


const unPerso = {

  identite: "Jean la Mèche",
  faction: FACTIONS.DEMONS,
  superieur: "Baal",
  grade: 3,

  caracteristiques: {
    force: 4,
    agilite: 6,
    perception: 5,
    volonte: 7,
    presence: 1.5,
    foi: 5,
  },
  pa: 12,
  paTotal: 9001,
  pp: 60,
  ppMax: 50, // max PP is governed by faith + bought PP; not sure if it's the best to store it raw like this

}


export class TalentStandard {
  name: string;
  id: string;
  associatedChara: string;
  specialisationType: string;
  isInnate: boolean;
  talentType: string;
  constructor(name: string, id: string, associatedChara: string, specialisationType: string, isInnate: boolean, talentType: string,
  ) {
    this.name = name;
    this.id = id;
    this.associatedChara = associatedChara;
    this.specialisationType = specialisationType;
    this.isInnate = isInnate;
    this.talentType = talentType;
  }

  static fromJson(json: {
    nom: string; caracteristique_associe: string; specialisation: string; inne: boolean; type: string; id: string;
  }) {
    return new TalentStandard(json.nom, json.id, json.caracteristique_associe, json.specialisation, json.inne, json.type,
    )
  }
}
interface LoadedTalentJson {
  "specialisation": string,
  "id": string,
  "nom": string,
  "caracteristique_associe": string,
  "inne": boolean,
  "superieur_exotique": string,
  "type": string
}
//@ts-ignore
const talentsJsonCasted: LoadedTalentJson[] = talentsJson;
export const TOUS_LES_TALENTS = talentsJsonCasted.map(TalentStandard.fromJson);
export const findStandardTalentById = (id:string) => {
  return TOUS_LES_TALENTS.find(x=>x.id===id);
}
export const TALENTS_PRINCIPAUX_STANDARD = TOUS_LES_TALENTS.filter((talent) => { return talent.talentType === "Principal"; })
export const TALENTS_SECONDAIRES_STANDARD = TOUS_LES_TALENTS.filter((talent) => { return talent.talentType === "Secondaire"; })
export interface TalentExistant {
  pa_depense: number,
  niveau: number,
  customNameFragment?: string
}
export interface TalentsCollection {
  [key: string]: TalentExistant;
}
export interface ICaracteristiquesSet {
  [index: string] : number,
  force: number,
  agilite: number,
  perception: number,
  volonte: number,
  presence: number,
  foi: number,
}

export interface Caracteristique{
  // niveau: number,
  pa_depense:number
}
export interface ICaracteristiquesSet2 {
  [index: string] : Caracteristique,
  force: Caracteristique,
  agilite: Caracteristique,
  perception: Caracteristique,
  volonte: Caracteristique,
  presence: Caracteristique,
  foi: Caracteristique,
}

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}


export const INSMVNumberInput = (props: NumberInputProps) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

const FeuilleDePerso = (props: {}) => {
  return (
    <Stack>
      <BillingPanel/>

      <Generalites />

      <Caracteristiques />
      <Status/>
      <Talents />

    </Stack>
  );
}


const App = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <SegmentedControl
          data={[
            { label: "Creation", value: "create" },
            { label: "Update", value: "update" },

          ]} />
        <FeuilleDePerso />
      </NotificationsProvider>
    </MantineProvider>
  );
}
export default App;
