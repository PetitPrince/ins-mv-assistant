import { Autocomplete, Select, TextInput, Title } from '@mantine/core';
import { NumberInput, Stack, Group } from '@mantine/core';
import { FACTIONS, SUPERIEURS_ANGES, SUPERIEURS_DEMONS } from './myConst';
import { useStore } from "./Store";

interface SuperieurProps {
  value: string;
  faction: string;
  onBlur: (val: string) => void;
}
function Superieur(props: SuperieurProps) {
  const { value, faction, onBlur } = props;

  let superieurs;
  switch (faction) {
    case FACTIONS.ANGES:
      superieurs = SUPERIEURS_ANGES;
      break;
    case FACTIONS.DEMONS:
      superieurs = SUPERIEURS_DEMONS;
      break;
    default:
      superieurs = [''];
      break;
  }

  return (
    <Autocomplete
      data={superieurs}
      label="Supérieur"
      limit={1000}
      value={value}
      onChange={onBlur} />
  );
}
export function Generalites(props: {}) {
  const identite = useStore((state) => state.currentPerso.identite) ;
  const faction = useStore((state) => state.currentPerso.faction) ;
  const superieur = useStore((state) => state.currentPerso.superieur) ;
  const grade = useStore((state) => state.currentPerso.grade);

  const setCurrentIdentite = useStore((state) => state.setCurrentIdentite);
  const setCurrentFaction = useStore((state) => state.setCurrentFaction);
  const setCurrentSuperieur = useStore((state) => state.setCurrentSuperieur);
  const setCurrentGrade = useStore((state) => state.setCurrentGrade);

  return (
    <Stack>
      <Title order={2}>Généralités</Title>
      {/* <Button onClick={printFeed}>Print feedback</Button> */}
      <Group>
        <TextInput
          label="Identité"
          defaultValue={identite}
          onBlur={(event) => {setCurrentIdentite(event.currentTarget.value)}} />
        <Select
          label="Faction"
          value={faction}

          data={[
            { value: FACTIONS.ANGES, label: "Anges" },
            { value: FACTIONS.DEMONS, label: "Démons" },
            { value: FACTIONS.TROISIEME_FORCE, label: "Troisième force" },
            { value: FACTIONS.AUTRE, label: "Autre" }
          ]}
          onChange={(val: FACTIONS) => setCurrentFaction(val)} />
        <Superieur
          value={superieur}
          onBlur={(val: string) => setCurrentSuperieur(val)}
          faction={faction} />

        <NumberInput label="Grade" min={0} max={4} defaultValue={grade}
          onChange={(val: number) => setCurrentGrade(val)} />
      </Group>
    </Stack>
  );
}
