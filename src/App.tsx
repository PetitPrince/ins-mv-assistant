import './App.css';
import { MantineProvider, NumberInputProps } from '@mantine/core';
import { NumberInput, Stack, Group, Table } from '@mantine/core';
import { Radio, Text, SegmentedControl } from '@mantine/core';
import { FACTIONS } from './myConst';
import create from 'zustand'
import produce, {  } from "immer"
import { enablePatches } from "immer"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createPatch } from 'rfc6902'
import { ReplaceOperation } from "rfc6902/diff"
import { NotificationsProvider } from '@mantine/notifications';
import { IBillingItem, calcBillingItemSum, BillingPanel, generateBillingItems } from './BillingItem';
import { Status } from './Status';
import { Caracteristiques } from './Caracteristiques';

enablePatches()
export enum CARACTERISTIQUES {
  FORCE = "force",
  AGILITE = "agilite",
  PERCEPTION = "perception",
  VOLONTE = "volonte",
  PRESENCE = "presence",
  FOI = "foi"
}


export interface ICaracteristiquesSet {
  force: number,
  agilite: number,
  perception: number,
  volonte: number,
  presence: number,
  foi: number,
}
// export type TcaracteristiquesSet = {
//   [K in CARACTERISTIQUES as string]: number;
// }

const emptyPerso: Personnage = {
  identite: "",
  faction: FACTIONS.AUTRE,
  superieur: "",
  grade: 0,
  caracteristiques: {
    force: 2,
    agilite: 2,
    perception: 2,
    volonte: 2,
    presence: 2,
    foi: 2,
  },
  pa: 0,
  paTotal: 0,
  pp: 0,
  ppMax: 0
};

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




export interface Personnage {
  identite: String,
  faction: FACTIONS,
  superieur: String, // todo: enum
  grade: 0 | 1 | 2 | 3 | 4, // todo: enum `availableGrades` ?
  caracteristiques: ICaracteristiquesSet,
  pa: number,
  paTotal: number,
  pp: number,
  ppMax: number,
  // TODO: talents, pouvoirs
}

interface Store {
  currentPerso: Personnage,
  originalPerso: Personnage,
  billingItems: IBillingItem[],
  paAfterBilling: number,

  setPerso: (val: Personnage) => void,
  setOriginalPerso: (val: Personnage) => void,
  setDraftCaracteristiques: (val: number, caracteristique: CARACTERISTIQUES) => void,
  setDraftPa: (val: number) => void,
  setDraftPaTotal: (val: number) => void,
  setDraftPp: (val: number) => void,
  setDraftPpMax: (val: number) => void,
  setDraftFaction: (val: FACTIONS) => void,
  updateBilling: (originalPerso: Personnage, draftPerso: Personnage) => void
}

export const useStore = create<Store>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,

  updateBilling: (originalPerso, draftPerso) => {
    const updatedBillingItems = generateBillingItems(originalPerso, draftPerso);
    set(produce(draftState => {
      draftState.billingItems = updatedBillingItems;
      draftState.paAfterBilling = get().currentPerso.pa - calcBillingItemSum(updatedBillingItems);
    }
    ))
  },
  setPerso: (val) => {
    set(produce(draftState => { draftState.currentPerso = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setOriginalPerso: (val) => {
    set(produce(draftState => { draftState.originalPerso = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setDraftCaracteristiques: (val, cara) => {
    set(produce(draftState => {
      draftState.currentPerso.caracteristiques[cara] = val;
    }));
    get().updateBilling(get().originalPerso, get().currentPerso);

  },

  setDraftPa: (val) => {
    set(
      produce(draftState => {
        draftState.currentPerso.pa = val;
      }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setDraftPaTotal: (val) => {
    set(
      produce(draftState => {
        draftState.currentPerso.paTotal = val;
      }));
  },
  setDraftPp: (val) => {
    set(
      produce(draftState => {
        draftState.currentPerso.pp = val;
      }));
  },
  setDraftPpMax: (val) => {
    set(
      produce(draftState => {
        draftState.currentPerso.ppMax = val;
      }));
  },
  setDraftFaction: (val) => {
    set(
      produce(draftState => {
        draftState.currentPerso.faction = val;
      }));
  },

}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}




export const INSMVNumberInput = (props: NumberInputProps) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

function FeuilleDePerso(props: { draftPerso: Personnage, originalPerso: Personnage, billingItems: IBillingItem[], paAfterBilling: number }) {
  const { draftPerso, originalPerso, billingItems, paAfterBilling } = props;
  // const {draftIdentite, draftFaction, draftSuperieur, draftGrade, draftCaracteristiques, draftPa, draftPaTotal, draftPp, draftPpMax} = props.draftPerso;
  // const {identite, faction, superieur, grade, caracteristiques, pa, paTotal, pp, ppMax} = props.perso;

  return (
    <Stack>
      <BillingPanel
        billingItems={billingItems}
        initialPa={draftPerso.pa}
      />

      <Caracteristiques
        caracteristiques={draftPerso.caracteristiques}
        initialCaracteristiques={originalPerso.caracteristiques}
        // caraState={caraState}
        // caraSetState={caraSetState}
        availablePa={paAfterBilling}
      // onChangeCara={caraChangeHandler}
      />
      <Status pa={draftPerso.pa} paTotal={draftPerso.paTotal}
        pp={draftPerso.pp} ppMax={draftPerso.ppMax}
        force={draftPerso.caracteristiques.force}
        faction={draftPerso.faction}
      />

      <Group>
        <Text>{draftPerso.caracteristiques.force}</Text>

      </Group>
    </Stack>
  );


}


function App() {
  const perso = useStore((state) => state.currentPerso);
  const originalPerso = useStore((state) => state.originalPerso);
  const billingItems = useStore((state) => state.billingItems);
  const paAfterBilling = useStore((state) => state.paAfterBilling);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <SegmentedControl
          data={[
            { label: "Creation", value: "create" },
            { label: "Update", value: "update" },

          ]} />
        <FeuilleDePerso draftPerso={perso} originalPerso={originalPerso} billingItems={billingItems} paAfterBilling={paAfterBilling} />
      </NotificationsProvider>
    </MantineProvider>
  );
}
export default App;
