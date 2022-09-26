import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { getCaracteristiqueLevel, useStore } from "../../store/Store";
import { Blessures } from "./Blessures";
import { NumberInput, Stack, Group, Title } from "@mantine/core";

export const Status = (props: {}) => {
  const pa = useStore((state) => state.currentPerso.pa);
  const currentPerso = useStore((state) => state.currentPerso);
  const faction = useStore((state) => state.currentPerso.faction);
  const ppMax = useStore((state) => state.currentPerso.ppMax);
  const force = getCaracteristiqueLevel(currentPerso, CARACTERISTIQUE_NAMES.FORCE);

  const setCurrentPa = useStore((state) => state.setCurrentPa);
  const storePpMax = useStore((state) => state.setCurrentPpMax);
  const setPpMax = (val: number) => storePpMax(val);

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <NumberInput
          label="Point d'Administration (PA) restant"
          value={pa}
          onChange={(val: number) => {
            setCurrentPa(val);
          }}
        />
        {/* <NumberInput label="PA accumulés" value={paTotal}/> */}
        {/* <NumberInput label="Point de Pouvoir (PP)" value={props.pp}
                    onChange={(val: number) => { setPp(val) }}/> */}
        <NumberInput
          label="PP Maximum"
          value={ppMax}
          onChange={(val: number) => {
            setPpMax(val);
          }}
        />
        <Blessures force={force} faction={faction} />
      </Group>
    </Stack>
  );
};
