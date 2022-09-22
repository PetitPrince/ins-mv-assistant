import './App.css';
import { ActionIcon, Box, Button, Center, Grid, InputProps, MantineProvider, NumberInputProps, Popover, TextInput, Title } from '@mantine/core';
import { NumberInput, Stack, Group, Table } from '@mantine/core';
import { Radio, Text, SegmentedControl, AutocompleteProps } from '@mantine/core';
import { FACTIONS } from './myConst';
import create from 'zustand'
import produce, { } from "immer"
import { enablePatches } from "immer"
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createPatch } from 'rfc6902'
import { ReplaceOperation } from "rfc6902/diff"
import { NotificationsProvider } from '@mantine/notifications';
import { IBillingItem, calcBillingItemSum, BillingPanel, generateBillingItems } from './Billing';
import { Status } from './Status';
import { Caracteristiques } from './Caracteristiques';
import { Generalites } from './Generalites';
import { IconCheck, IconEdit, IconSortAscendingLetters, IconTool, IconX } from '@tabler/icons';
import talentsJson from './talents.json';

enablePatches()

export enum CARACTERISTIQUES {
  FORCE = "force",
  AGILITE = "agilite",
  PERCEPTION = "perception",
  VOLONTE = "volonte",
  PRESENCE = "presence",
  FOI = "foi"
}


// export interface ICaracteristiquesSet {
//   force: number,
//   agilite: number,
//   perception: number,
//   volonte: number,
//   presence: number,
//   foi: number,
// }
export type TCaracteristiquesSet = {
  [K in CARACTERISTIQUES as string]: number;
}

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
  ppMax: 0,
  freeTalentPoints: 0,
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
    secondaire: {
      "aisance-sociale": {
        niveau: 3
      }
    },
    exotique: {}
  }

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


export interface Talent {
  // nom: string,
  niveau: number,
  customNameFragment?: string
}

class TalentStandard {
  name: string;
  id: string;
  associatedChara: string;
  specialisationType: string;
  isInnate: boolean;
  talentType: string;
  // restriction: string;
  constructor(name: string, id: string, associatedChara: string, specialisationType: string, isInnate: boolean, talentType: string,
    // restriction: string
  ) {
    /**
     * Two modes of working: only name and level
     */
    this.name = name;
    this.id = id;
    this.associatedChara = associatedChara;
    this.specialisationType = specialisationType;
    this.isInnate = isInnate;
    this.talentType = talentType;
    // this.restriction = restriction;
  }

  static fromJson(json: {
    nom: string; caracteristique_associe: string; specialisation: string; inne: boolean; type: string; id: string;
    //  restriction: string;
  }) {
    return new TalentStandard(json.nom, json.id, json.caracteristique_associe, json.specialisation, json.inne, json.type,
      // json.restriction
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
const talentsJson2: LoadedTalentJson[] = talentsJson;
export const allTalents = talentsJson2.map(TalentStandard.fromJson);
const TALENTS_PRINCIPAUX_STANDARD = allTalents.filter((talent) => { return talent.talentType === "Principal"; })

interface TalentsCollection {
  [key: string]: Talent;
}
export interface Personnage {
  identite: String,
  faction: FACTIONS,
  superieur: String, // todo: enum
  grade: 0 | 1 | 2 | 3 | 4, // todo: enum `availableGrades` ?
  caracteristiques: TCaracteristiquesSet,
  pa: number,
  paTotal: number,
  pp: number,
  ppMax: number,
  freeTalentPoints: number,
  talents: {
    principaux: TalentsCollection
    secondaire: TalentsCollection,
    exotique: TalentsCollection,
  }
  // TODO: talents, pouvoirs
}

interface Store {
  currentPerso: Personnage,
  originalPerso: Personnage,
  billingItems: IBillingItem[],
  paAfterBilling: number,

  setPerso: (val: Personnage) => void,
  setOriginalPerso: (val: Personnage) => void,
  setCurrentIdentite: (val: string) => void,
  setCurrentFaction: (val: FACTIONS) => void,
  setCurrentGrade: (val: number) => void,
  setCurrentSuperieur: (val: string) => void,
  setCurrentCaracteristiques: (val: number, caracteristique: CARACTERISTIQUES) => void,
  setCurrentPa: (val: number) => void,
  setCurrentPaTotal: (val: number) => void,
  setCurrentPp: (val: number) => void,
  setCurrentPpMax: (val: number) => void,
  setCurrentFreeTalentPoints: (val: number) => void,
  setCurrentTalentPrincipal: (talentId: string, val: Talent) => void,
  updateBilling: (originalPerso: Personnage, draftPerso: Personnage) => void
}

export const useStore = create<Store>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,
  freeTalentPoints: 0,

  updateBilling: (originalPerso, draftPerso) => {
    const updatedBillingItems = generateBillingItems(originalPerso, draftPerso);
    const updatesOnTalentsPrincipaux = updatedBillingItems.filter(x => x.key.startsWith("/talents/principaux"));
    let updatedCurrentFreeTalentPoints = 0;
    for (const updateOnTalentsPrincipaux of updatesOnTalentsPrincipaux) {
      if (updateOnTalentsPrincipaux.cost != null && updateOnTalentsPrincipaux.cost != NaN) {
        console.log("old freeTalentPoints: " + updatedCurrentFreeTalentPoints);
        console.log("updateOnTalentsPrincipaux.cost: " + updateOnTalentsPrincipaux.cost);
        updatedCurrentFreeTalentPoints += updateOnTalentsPrincipaux.cost;
        console.log("new freeTalentPoints: " + updatedCurrentFreeTalentPoints);
      }
    }
    set(produce(draftState => {
      draftState.billingItems = updatedBillingItems;
      draftState.currentPerso.freeTalentPoints = updatedCurrentFreeTalentPoints;
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
  setCurrentIdentite: (val) => {
    set(produce(draftState => { draftState.currentPerso.identite = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentFaction: (val) => {
    set(produce(draftState => { draftState.currentPerso.faction = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentGrade: (val) => {
    set(produce(draftState => { draftState.currentPerso.grade = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentSuperieur: (val) => {
    set(produce(draftState => { draftState.currentPerso.superieur = val }))
    get().updateBilling(get().originalPerso, get().currentPerso);
  },
  setCurrentCaracteristiques: (val, cara) => {
    set(produce(draftState => { draftState.currentPerso.caracteristiques[cara] = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);

  },
  setCurrentPa: (val) => {
    set(produce(draftState => { draftState.currentPerso.pa = val; }));
    get().updateBilling(get().originalPerso, get().currentPerso);
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
    set(produce(draftState => { draftState.currentPerso.talents.principaux[talentId] = val }));
    get().updateBilling(get().originalPerso, get().currentPerso);
  }

}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}




export const INSMVNumberInput = (props: NumberInputProps) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

interface TalentDisplayRow {
  id: string,
  name: string,
  level: number | undefined,
  associatedCarac: string,
  isNameEditable: boolean
}

function computeRowsTalentsPrincipaux(characterTalents: TalentsCollection, characterCara: TCaracteristiquesSet) {
  let rows: TalentDisplayRow[] = [];

  // Go through the list of standard talents, display those who are presents
  for (const standardTalent of TALENTS_PRINCIPAUX_STANDARD) {
    const { name, id, associatedChara, isInnate, specialisationType } = standardTalent;
    switch (specialisationType) {
      case "Spécifique":
        const isNameEditable = id.includes("specifique")

        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          const displayName = existingTalent.customNameFragment ? name + " (" + existingTalent.customNameFragment + ")" : name;
          rows.push({
            id: id,
            name: displayName,
            level: existingTalent.niveau,
            associatedCarac: associatedChara,
            isNameEditable: isNameEditable
          })
        } else {
          const defaultLevel = isInnate ? Math.floor(characterCara[associatedChara] / 2) : undefined
          const displayName = isNameEditable ? name + "(...)" : name
          rows.push({
            id: id,
            name: displayName,
            level: defaultLevel,
            associatedCarac: associatedChara,
            isNameEditable: isNameEditable
          })
        }
        break;
      case "Générique":
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          rows.push({
            id: id,
            name: name,
            level: existingTalent.niveau,
            associatedCarac: associatedChara,
            isNameEditable: false
          })
        } else {
          const defaultLevel = isInnate ? Math.floor(characterCara[associatedChara] / 2) : undefined
          rows.push({
            id: id,
            name: name,
            level: defaultLevel,
            associatedCarac: associatedChara,
            isNameEditable: false
          })
        }


        break;
    }
  }

  return rows;

}



function TalentsPrincipaux(props: {characterTalents: TalentsCollection}) {
  const perso = useStore((state) => state.currentPerso);
  const originalPerso = useStore((state) => state.originalPerso);
  const storeCurrentTalentPrincipal = useStore(state => state.setCurrentTalentPrincipal);
  const setCurrentTalentPrincipal = (id: string, val: number | undefined, newCustomNameFragment?: string) => {
    if (val != undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(perso.talents.principaux, id) && perso.talents.principaux[id].customNameFragment) {
        updatedCustomNameFragment = perso.talents.principaux[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      const newTal: Talent = updatedCustomNameFragment ? {
        niveau: val,
        customNameFragment: updatedCustomNameFragment
      } : {
        niveau: val,
      }
      storeCurrentTalentPrincipal(id, newTal)
    }
  };
  const rows = computeRowsTalentsPrincipaux(props.characterTalents, perso.caracteristiques)
  return (
    <Stack>
      <Title order={3}>Talents principaux</Title>
      {/* To this after */}
      {/* <SegmentedControl data={[
        {
          label: (<Center>
            <IconSortAscendingLetters size={16} />
            <Box ml={10}>Alphabétique</Box>
          </Center>
          ), 
          value: 'alpha'
        },
        {
          label: (<Center>
            <IconTool size={16} />
            <Box ml={10}>Utilisation</Box>
          </Center>
          ), 
          value: 'usage'
        },
      ]} /> */}
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Carac</th>
          </tr>
        </thead>
        <tbody>{
          rows.map((row: TalentDisplayRow) => {
            let isModified = false;
            if (Object.hasOwn(originalPerso.talents.principaux, row.id)) {
              isModified = row.level !== originalPerso.talents.principaux[row.id].niveau;
            } else {
              console.log(row.level || 0);

              isModified = (row.level || 0) > 1;
            }
            const availablePa = perso.pa;
            const variant = isModified ? "filled" : "default";
            const radius = isModified ? "xl" : "sm";
            let errorString = isModified && availablePa < 0 ? "  " : "";

            if (row.isNameEditable) {
              const primaryTalentId = row.id.split("-specifique")[0]
              const primaryTalent = perso.talents.principaux[primaryTalentId]
              if (primaryTalent && row.level) {
                if (primaryTalent.niveau > row.level) {
                  errorString = "Le niveau du talent général ne peut pas dépasser la spécialité"
                }
              }
              console.log();
              return (
                <tr key={row.name}>
                  <td>{row.name}
                    <Popover width={300} trapFocus position="bottom" shadow="md">
                      <Popover.Target>
                        <ActionIcon><IconEdit size={16} /></ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown >
                        <form
                          onSubmit={(event: any) => { let talentNameFragment = event.target.talentNameFragment.value; setCurrentTalentPrincipal(row.id, row.level, talentNameFragment) }}
                        >
                          <TextInput label="Nom de la spécialisation" name="talentNameFragment" size="xs" />
                          <Button type="submit">Changer</Button>
                        </form>
                      </Popover.Dropdown>
                    </Popover>
                  </td>
                  <td><INSMVNumberInput error={errorString} variant={variant} radius={radius} value={row.level} min={0} onChange={(val: number) => { setCurrentTalentPrincipal(row.id, val) }} /></td>
                  <td>{row.associatedCarac}</td>
                </tr>
              )
            } else {
              return (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td><INSMVNumberInput error={errorString} variant={variant} radius={radius} value={row.level} min={0} onChange={(val: number) => { setCurrentTalentPrincipal(row.id, val) }} /></td>
                  <td>{row.associatedCarac}</td>
                </tr>
              );
            }
          }
          )
        }</tbody>
      </Table>
    </Stack>
  );
}


function Talents(props: {
  talents: {

    principaux: TalentsCollection,
    secondaire: TalentsCollection,
    exotique: TalentsCollection,

  }
}) { // TODO: props

  return (
    <Stack>
      <Title order={2}>Talents</Title>
      <Grid>
        <Grid.Col span={4}>
          <TalentsPrincipaux characterTalents={props.talents.principaux}/>
        </Grid.Col>
        {/* <Grid.Col span={4}>
          <TalentsExotiques talentsExotiquesDuPerso={props.talentsExotiquesDuPerso} />
        </Grid.Col>
        <Grid.Col span={4}>
          <TalentsSecondaires
           talentsSecondairesDuPerso={props.talentsSecondairesDuPerso} 
           />
        </Grid.Col> */}
      </Grid>
    </Stack>

  );
}

function FeuilleDePerso(props: { currentPerso: Personnage, originalPerso: Personnage, billingItems: IBillingItem[], paAfterBilling: number }) {
  const { currentPerso, originalPerso, billingItems, paAfterBilling } = props;
  // const {draftIdentite, draftFaction, draftSuperieur, draftGrade, draftCaracteristiques, draftPa, draftPaTotal, draftPp, draftPpMax} = props.draftPerso;
  // const {identite, faction, superieur, grade, caracteristiques, pa, paTotal, pp, ppMax} = props.perso;

  return (
    <Stack>
      <BillingPanel
        billingItems={billingItems}
        initialPa={currentPerso.pa}
      />

      <Generalites
        identite={currentPerso.identite}
        faction={currentPerso.faction}
        superieur={currentPerso.superieur}
        grade={currentPerso.grade}
      />

      <Caracteristiques
        caracteristiques={currentPerso.caracteristiques}
        initialCaracteristiques={originalPerso.caracteristiques}
        // caraState={caraState}
        // caraSetState={caraSetState}
        availablePa={paAfterBilling}
      // onChangeCara={caraChangeHandler}
      />
      <Status pa={currentPerso.pa} paTotal={currentPerso.paTotal}
        pp={currentPerso.pp} ppMax={currentPerso.ppMax}
        force={currentPerso.caracteristiques.force}
        faction={currentPerso.faction}
      />
      <Talents talents={currentPerso.talents} />
      <Group>
        <Text> debug free secondary talent points {currentPerso.freeTalentPoints}</Text>
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
        <FeuilleDePerso currentPerso={perso} originalPerso={originalPerso} billingItems={billingItems} paAfterBilling={paAfterBilling} />
      </NotificationsProvider>
    </MantineProvider>
  );
}
export default App;
