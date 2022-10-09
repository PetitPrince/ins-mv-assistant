import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import {
  SUPERIEURS_ANGES_AUTOCOMPLETE,
  SUPERIEURS_DEMONS_AUTOCOMPLETE,
} from "../../utils/const/Superieurs";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { NumberInput, Stack, Group } from "@mantine/core";

const Superieur = (props: {}) => {
  const value = useStore((state) => state.currentPerso.superieur);
  const faction = useStore((state) => state.currentPerso.faction);

  const setCurrentSuperieur = useStore((state) => state.setCurrentSuperieur);

  let superieurs;
  switch (faction) {
    case FACTIONS_NAMES.ANGES:
      superieurs = SUPERIEURS_ANGES_AUTOCOMPLETE;
      break;
    case FACTIONS_NAMES.DEMONS:
      superieurs = SUPERIEURS_DEMONS_AUTOCOMPLETE;
      break;
    default:
      superieurs = [""];
      break;
  }

  return (
    <Autocomplete
      data={superieurs}
      label="Supérieur"
      limit={1000}
      defaultValue={value}
      // onChange={(val: string) => setCurrentSuperieur(val)}
      onItemSubmit={(val: AutocompleteItem) => setCurrentSuperieur(val.value)}
    />
  );
};
export const Generalites = (props: {}) => {
  const identite = useStore((state) => state.currentPerso.identite);
  const faction = useStore((state) => state.currentPerso.faction);
  const grade = useStore((state) => state.currentPerso.grade);
  const pa = useStore((state) => state.currentPerso.pa);
  const paTotal = useStore((state) => state.currentPerso.paTotal);

  const setCurrentIdentite = useStore((state) => state.setCurrentIdentite);
  const setCurrentFaction = useStore((state) => state.setCurrentFaction);
  const setCurrentGrade = useStore((state) => state.setCurrentGrade);

  const setCurrentPa = useStore((state) => state.setCurrentPa);
  const changeFaction = (newFaction: FACTIONS_NAMES) => {
    setCurrentFaction(newFaction);
    switch (newFaction) {
      case FACTIONS_NAMES.ANGES:
        setCurrentPa(100);
        break;
      case FACTIONS_NAMES.DEMONS:
        setCurrentPa(80);
        break;
      default:
        break;
    }
  };

  return (
    <Stack>
      <Title order={2}>Généralités</Title>
      {/* <Button onClick={printFeed}>Print feedback</Button> */}
      <Group>
        <TextInput
          label="Identité"
          defaultValue={identite}
          onBlur={(event) => {
            setCurrentIdentite(event.currentTarget.value);
          }}
        />
        <Select
          label="Faction"
          value={faction}
          data={[
            { value: FACTIONS_NAMES.ANGES, label: "Anges" },
            { value: FACTIONS_NAMES.DEMONS, label: "Démons" },
            { value: FACTIONS_NAMES.TROISIEME_FORCE, label: "Troisième force" },
            { value: FACTIONS_NAMES.AUTRE, label: "Autre" },
          ]}
          onChange={(val: FACTIONS_NAMES) => changeFaction(val)}
        />
        <Superieur />

        <NumberInput
          label="Grade"
          min={0}
          max={4}
          defaultValue={grade}
          onChange={(val: number) => setCurrentGrade(val)}
        />

        <NumberInput
          label="Point d'Administration (PA) restant"
          value={pa}
          onChange={(val: number) => {
            setCurrentPa(val);
          }}
        />
        <NumberInput
          label="PA dépense"
          value={paTotal}
          hideControls
          readOnly
          variant="filled"
        />
      </Group>
    </Stack>
  );
};
