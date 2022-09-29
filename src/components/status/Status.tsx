import { useStore } from "../../store/Store";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { Blessures } from "./Blessures";
import {
  NumberInput,
  Stack,
  Group,
  Title,
  Card,
  Center,
  Text,
} from "@mantine/core";

export const calcPPFromPaDepense = (
  volonte: number,
  foi: number,
  pa_depense: number
) => {
  return volonte + foi + pa_depense;
};

export const Status = (props: {}) => {
  const pa = useStore((state) => state.currentPerso.pa);
  const paTotal = useStore((state) => state.currentPerso.paTotal);
  const force_pa_depense = useStore(
    (state) => state.currentPerso.caracteristiques.force.pa_depense
  );
  const volonte_pa_depense = useStore(
    (state) => state.currentPerso.caracteristiques.volonte.pa_depense
  );
  const foi_pa_depense = useStore(
    (state) => state.currentPerso.caracteristiques.foi.pa_depense
  );
  const pp_pa_depense = useStore((state) => state.currentPerso.pp_pa_depense);
  const faction = useStore((state) => state.currentPerso.faction);
  const setCurrentPpPadepense = useStore(
    (state) => state.setCurrentPpPadepense
  );
  const setCurrentPa = useStore((state) => state.setCurrentPa);

  const force = calcCaracteristiqueLevelFromPaDepense(force_pa_depense);
  const volonte = calcCaracteristiqueLevelFromPaDepense(volonte_pa_depense);
  const foi = calcCaracteristiqueLevelFromPaDepense(foi_pa_depense);
  const ppMax = calcPPFromPaDepense(volonte, foi, pp_pa_depense);

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <Stack>
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
          />
        </Stack>
        {/* <NumberInput label="PA accumulés" value={paTotal}/> */}
        {/* <NumberInput label="Point de Pouvoir (PP)" value={props.pp}
                    onChange={(val: number) => { setPp(val) }}/> */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Card.Section>
            <Center>
              <Text size="xs">PP</Text>
            </Center>
            <Center>
              <Title>{ppMax}</Title>
            </Center>
          </Card.Section>
          <NumberInput
            size="sm"
            styles={{ input: { width: 75, textAlign: "center" } }}
            label="PA dépensé"
            value={pp_pa_depense}
            onChange={(val: number) => setCurrentPpPadepense(val)}
          />
        </Card>

        <Blessures force={force} faction={faction} />
      </Group>
    </Stack>
  );
};
