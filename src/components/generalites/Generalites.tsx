import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Superieur } from "./Superieur";
import { Select, TextInput, Title } from "@mantine/core";
import { NumberInput, Stack, Group } from "@mantine/core";

export const Generalites = (props: {}) => {
  const identite = useStore((state) => state.currentPerso.identite);
  const faction = useStore((state) => state.currentPerso.faction);
  const grade = useStore((state) => state.currentPerso.grade);
  const pa = useStore((state) => state.currentPerso.pa);
  const paTotal = useStore((state) => state.currentPerso.paTotal);
  const appmode = useStore((state) => state.appMode);

  const setCurrentIdentite = useStore((state) => state.setCurrentIdentite);
  const setCurrentFaction = useStore((state) => state.setCurrentFaction);
  const setCurrentGrade = useStore((state) => state.setCurrentGrade);

  const setCurrentPa = useStore((state) => state.setCurrentPa);

  const factionDisabled = appmode === APPMODE.UPDATE; // not worrying about play mode because faction is not accessible anyway

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
      <Stack>
        <TextInput
          label="Identité"
          defaultValue={identite}
          onBlur={(event) => {
            setCurrentIdentite(event.currentTarget.value);
          }}
        />
        <Group>
          <Select
            label="Faction"
            value={faction}
            disabled={factionDisabled}
            data={[
              { value: FACTIONS_NAMES.ANGES, label: "Anges" },
              { value: FACTIONS_NAMES.DEMONS, label: "Démons" },
              {
                value: FACTIONS_NAMES.TROISIEME_FORCE,
                label: "Troisième force",
              },
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
        </Group>
        <Group>
          <NumberInput
            label="Point d'Administration (PA) restant"
            value={pa}
            onChange={(val: number) => {
              setCurrentPa(val);
            }}
          />
          <NumberInput
            label="PA dépensé au total"
            value={paTotal}
            hideControls
            readOnly
            variant="filled"
          />
        </Group>
      </Stack>
    </Stack>
  );
};
