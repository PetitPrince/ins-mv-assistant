import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { SUPERIEURS_ANGES, SUPERIEURS_DEMONS } from "../../utils/const/Superieurs";
import { useStore } from "../../store/Store";
import { Autocomplete, Select, TextInput, Title } from "@mantine/core";
import { NumberInput, Stack, Group } from "@mantine/core";

const Superieur = (props: {}) => {
  const value = useStore((state) => state.currentPerso.superieur);
  const faction = useStore((state) => state.currentPerso.faction);

  const setCurrentSuperieur = useStore((state) => state.setCurrentSuperieur);

  let superieurs;
  switch (faction) {
    case FACTIONS_NAMES.ANGES:
      superieurs = SUPERIEURS_ANGES;
      break;
    case FACTIONS_NAMES.DEMONS:
      superieurs = SUPERIEURS_DEMONS;
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
      value={value}
      onChange={(val: string) => setCurrentSuperieur(val)}
    />
  );
};
export const Generalites = (props: {}) => {
  const identite = useStore((state) => state.currentPerso.identite);
  const faction = useStore((state) => state.currentPerso.faction);
  const grade = useStore((state) => state.currentPerso.grade);

  const setCurrentIdentite = useStore((state) => state.setCurrentIdentite);
  const setCurrentFaction = useStore((state) => state.setCurrentFaction);
  const setCurrentGrade = useStore((state) => state.setCurrentGrade);

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
          onChange={(val: FACTIONS_NAMES) => setCurrentFaction(val)}
        />
        <Superieur />

        <NumberInput
          label="Grade"
          min={0}
          max={4}
          defaultValue={grade}
          onChange={(val: number) => setCurrentGrade(val)}
        />
      </Group>
    </Stack>
  );
};
