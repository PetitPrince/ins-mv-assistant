import {
  ActionIcon,
  Button,
  Grid,
  NumberInput,
  Popover,
  TextInput,
  Title,
} from "@mantine/core";
import { Stack, Group, Table } from "@mantine/core";
import { Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import slugify from "slugify";
import {
  getCaracteristiqueLevel,
  getTalentLevel,
  Personnage,
  useStore,
} from "./Store";
import {
  TalentStandard,
  TalentsCollection,
  TalentExistant,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_SECONDAIRES_STANDARD,
  INSMVNumberInput,
} from "./App";
import { findTalentInCaracterFromName } from "./Billing";

interface TalentDisplayRow extends TalentStandard {
  level: number | undefined;
  pa_depense: number;
}
const computeRowsTalents = (
  characterTalents: TalentsCollection,
  currentPerso: Personnage,
  standardTalentPool: TalentStandard[]
) => {
  let rows: TalentDisplayRow[] = [];

  // Go through the list of standard talents, display those who are present
  for (const standardTalent of standardTalentPool) {
    const { name, id, associatedChara, isInnate, specialisationType } =
      standardTalent;
    switch (specialisationType) {
      case "Multiple":
        // Look for a family of talents in the character sheet, all starting with the same string (for instance all hobby, include "hobby" and
        // "hobby-dressage-de-bouquetin"). There could be an arbitrary number of them
        const characterTalentsStartingWithId = Object.entries(
          characterTalents
        ).filter(([k, v]) => k.startsWith(id));

        // For each on of them, add one row with their existing info
        for (const [
          existingTalentId,
          existingTalent,
        ] of characterTalentsStartingWithId) {
          rows.push({
            ...standardTalent,
            id: existingTalentId,
            name:
              standardTalent.name +
              " (" +
              existingTalent.customNameFragment +
              ")",
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense,
          });
        }
        // Also add a row to add a new one talent. The trigger is getting an undefined level
        rows.push({
          ...standardTalent,
          name: standardTalent.name + "...",
          level: undefined,
          pa_depense: 0,
        });
        break;

      case "Spécifique":
        // There's always a pair of Talent, The generic on doesn't have the "-specifique" suffix.
        const isSpecific = id.includes("specifique");

        // If the talent already exists in the character sheet, add a new row
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          const displayName = existingTalent.customNameFragment
            ? name + " (" + existingTalent.customNameFragment + ")"
            : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense,
          });
        } else {
          // otherwise add an empty row
          const defaultLevel = isInnate
            ? getCaracteristiqueLevel(currentPerso, associatedChara)
            : undefined;
          const displayName = isSpecific ? name + "(...)" : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: defaultLevel,
            pa_depense: 0,
          });
        }
        break;
      case "Générique":
        // If the talent already exists in the character sheet, add a new row
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          rows.push({
            ...standardTalent,
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense,
          });
        } else {
          // otherwise add an empty row
          const defaultLevel = isInnate
            ? getCaracteristiqueLevel(currentPerso, associatedChara)
            : undefined;
          rows.push({
            ...standardTalent,
            level: defaultLevel,
            pa_depense: 0,
          });
        }
        break;
    }
  }
  return rows;
};

const TalentRow = (props: {
  row: TalentDisplayRow;
  setCurrentTalentPaDense: (talentId: string, val: number) => void;
}) => {
  const row = props.row;
  const perso = useStore((state) => state.currentPerso);
  const talentPool = perso.talents.principaux;

  const niveau = getTalentLevel(perso, row.id);

  const setCurrentTalent = (
    id: string,
    val: number | undefined,
    newCustomNameFragment?: string
  ) => {
    if (val !== undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      props.setCurrentTalentPaDense(id, val);
    }
  };

  return (
    <tr key={row.id}>
      <td>{row.name}</td>
      <td>
        <INSMVNumberInput
          value={niveau}
          hideControls
          readOnly
          variant="unstyled"
        />
        <NumberInput
          value={row.pa_depense}
          onChange={(val: number) => {
            setCurrentTalent(row.id, val);
          }}
        />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
};

const TalentRowSpecifique = (props: {
  row: TalentDisplayRow;
  talentPool: TalentsCollection;
  setCurrentTalentPaDense: (talentId: string, val: number) => void;
  setCurrentTalentNameFragment: (talentId: string, val: string) => void;
}) => {
  const row = props.row;
  const talentId = row.id;
  const primaryTalentId = talentId.split("-specifique")[0];
  const currentPerso = useStore((state) => state.currentPerso);
  const talentPool = props.talentPool;

  // Check if the primary talent has a higher level than the specialized one
  // Output a warning in the UI if it's the case

  const isPrimaryTalentDefined = Object.hasOwn(talentPool, primaryTalentId); // does the primary talent (talent id without the -specifique suffix) exists in the standard list of talent ?
  let primaryTalentLevel = isPrimaryTalentDefined
    ? getTalentLevel(currentPerso, primaryTalentId)
    : 0;

  const specificTalentLevel = getTalentLevel(currentPerso, talentId);

  let errorString; // keep the if loop in case I want to have anoter error string
  if (primaryTalentLevel > specificTalentLevel) {
    errorString =
      "Le niveau du talent général ne peut pas dépasser la spécialité";
  }

  const setCurrentTalent = (
    id: string,
    val: number | undefined,
    newCustomNameFragment?: string
  ) => {
    if (val !== undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      props.setCurrentTalentPaDense(id, val);
    }
  };

  const setCurrentTalentNameFragment = (talentId: string, val: string) => {
    props.setCurrentTalentNameFragment(talentId, val);
  };

  return (
    <tr key={row.id}>
      <td>
        {row.name}
        <Popover width={300} trapFocus position="bottom" shadow="md">
          <Popover.Target>
            <ActionIcon>
              <IconEdit size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={(event: any) => {
                let talentNameFragment = event.target.talentNameFragment.value;
                setCurrentTalentNameFragment(row.id, talentNameFragment);
                event.preventDefault();
              }}
            >
              <TextInput
                label="Nom de la spécialisation"
                name="talentNameFragment"
                size="xs"
              />
              <Button type="submit">Changer</Button>
            </form>
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>
        <INSMVNumberInput
          error={errorString}
          value={specificTalentLevel}
          hideControls
          readOnly
          variant="unstyled"
        />
        <NumberInput
          value={row.pa_depense}
          onChange={(val: number) => {
            setCurrentTalent(row.id, val);
          }}
        />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
};

const TalentRowMultiple = (props: {
  row: TalentDisplayRow;
  talentPool: TalentsCollection;
  setCurrentTalent: (talentId: string, val: TalentExistant) => void;
}) => {
  const row = props.row;
  const talentId = row.id;
  const talentPool: TalentsCollection = props.talentPool;
  const currentPerso = useStore((state) => state.currentPerso);

  const setCurrentTalent = (
    id: string,
    val: number | undefined,
    newCustomNameFragment?: string
  ) => {
    if (val !== undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      const newTal: TalentExistant = updatedCustomNameFragment
        ? {
            customNameFragment: updatedCustomNameFragment,
            niveau: 0, // todo: this is useless
            pa_depense: val,
          }
        : {
            niveau: 0, // todo: this is useless
            pa_depense: val,
          };
      props.setCurrentTalent(id, newTal);
    }
  };
  if (row.level === undefined) {
    return (
      <tr key={row.id}>
        <td>{row.name}</td>
        <td>
          <Text>Nom du talent</Text>
          <Group mt="xs" spacing="xs">
            <form
              onSubmit={(event: any) => {
                let talentNameFragment = event.target.talentNameFragment.value;
                let newTalentFragmentName =
                  row.id + "_" + slugify(talentNameFragment, { lower: true });
                setCurrentTalent(newTalentFragmentName, 0, talentNameFragment);
                event.preventDefault();
              }}
            >
              <TextInput name="talentNameFragment" size="xs" />
              <Button size="xs" type="submit">
                Ajouter
              </Button>
            </form>
          </Group>
        </td>
        <td>{row.associatedChara}</td>
      </tr>
    );
  }
  // Get the fragment name from the displayed name
  const t = findTalentInCaracterFromName(currentPerso, row.id);
  const parensContent = t?.customNameFragment;
  // const justTheParens = row.name.match(/\([^\)]*\)/);
  // const parensContent = justTheParens ? justTheParens[0].slice(1, justTheParens[0].length - 1) : undefined;
  const niveau = getTalentLevel(currentPerso, talentId);

  return (
    <tr key={row.id}>
      <td>{row.name}</td>
      <td>
        <INSMVNumberInput
          value={niveau}
          hideControls
          readOnly
          variant="unstyled"
        />
        <NumberInput
          value={row.pa_depense}
          onChange={(val: number) => {
            setCurrentTalent(row.id, val, parensContent);
          }}
        />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
};

const TalentsGenerique = (props: {
  standardTalentPool: TalentStandard[];
  title: string;
  tpool: string;
}) => {
  const standardTalentPool = props.standardTalentPool;
  const title = props.title;
  const tpool = props.tpool;
  const characterTalentsPrincipaux = useStore(
    (state) => state.currentPerso.talents.principaux
  );
  const characterTalentsSecondaire = useStore(
    (state) => state.currentPerso.talents.secondaires
  );
  const setCurrentTalentPrincipalPaDepense = useStore(
    (state) => state.setCurrentTalentPrincipalPaDepense
  );
  const setCurrentTalentSecondairePaDepense = useStore(
    (state) => state.setCurrentTalentSecondairePaDepense
  );
  const setCurrentTalentPrincipalNameFragment = useStore(
    (state) => state.setCurrentTalentPrincipalNameFragment
  );
  const setCurrentTalentSecondaireNameFragment = useStore(
    (state) => state.setCurrentTalentSecondaireNameFragment
  );
  const setCurrentTalentSecondaire = useStore(
    (state) => state.setCurrentTalentSecondaire
  );
  const setCurrentTalentPrincipal = useStore(
    (state) => state.setCurrentTalentPrincipal
  );

  let characterTalents: TalentsCollection;
  let setCurrentTalentPaDense: (talentId: string, val: number) => void;
  let setCurrentTalentNameFragment: (talentId: string, val: string) => void;
  let setCurrentTalent: (talentId: string, val: TalentExistant) => void;
  if (tpool === "Principal") {
    characterTalents = characterTalentsPrincipaux;
    setCurrentTalentPaDense = setCurrentTalentPrincipalPaDepense;
    setCurrentTalentNameFragment = setCurrentTalentPrincipalNameFragment;
    setCurrentTalent = setCurrentTalentPrincipal;
  } else {
    characterTalents = characterTalentsSecondaire;
    setCurrentTalentPaDense = setCurrentTalentSecondairePaDepense;
    setCurrentTalentNameFragment = setCurrentTalentSecondaireNameFragment;
    setCurrentTalent = setCurrentTalentSecondaire;
  }
  const currentPerso = useStore((state) => state.currentPerso);

  const rows = computeRowsTalents(
    characterTalents,
    currentPerso,
    standardTalentPool
  );

  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Carac</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: TalentDisplayRow) => {
            switch (row.specialisationType) {
              case "Spécifique":
                const primaryTalentId = row.id.split("_specifique")[0];
                const isPrimary = primaryTalentId === row.id;
                if (!isPrimary) {
                  return (
                    <TalentRowSpecifique
                      row={row}
                      key={row.id}
                      talentPool={characterTalents}
                      setCurrentTalentPaDense={setCurrentTalentPaDense}
                      setCurrentTalentNameFragment={
                        setCurrentTalentNameFragment
                      }
                    />
                  );
                } else {
                  return (
                    <TalentRow
                      row={row}
                      key={row.id}
                      setCurrentTalentPaDense={setCurrentTalentPaDense}
                    />
                  );
                }
              case "Multiple":
                return (
                  <TalentRowMultiple
                    row={row}
                    key={row.id}
                    talentPool={characterTalents}
                    setCurrentTalent={setCurrentTalent}
                  />
                );
              default:
                return (
                  <TalentRow
                    row={row}
                    key={row.id}
                    setCurrentTalentPaDense={setCurrentTalentPaDense}
                  />
                );
            }
          })}
        </tbody>
      </Table>
    </Stack>
  );
};

/* --------------------------------------------- */

export const Talents = (props: {}) => {
  return (
    <Stack>
      <Title order={2}>Talents</Title>
      <Grid>
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents principaux"
            standardTalentPool={TALENTS_PRINCIPAUX_STANDARD}
            tpool="Principal"
          />
        </Grid.Col>
        {/* <Grid.Col span={4}>
              <TalentsExotiques talentsExotiquesDuPerso={props.talentsExotiquesDuPerso} />
            </Grid.Col>*/}
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents secondaires"
            standardTalentPool={TALENTS_SECONDAIRES_STANDARD}
            tpool="Secondaire"
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
