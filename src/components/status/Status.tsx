import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { LimitSliderThingy } from "../limitSliderThingy";
import { Blessures } from "./Blessures";
import {
  NumberInput,
  Stack,
  Group,
  Title,
  Card,
  Center,
  Text,
  Alert,
  Indicator,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

export const calcPPFromPaDepense = (
  volonte: number,
  foi: number,
  pa_depense: number
) => {
  return volonte + foi + pa_depense;
};

export const Status = (props: {}) => {
  const appMode = useStore((state) => state.appMode);
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

  let creationLimitMsg = "";
  let lowerLimit = 2;
  let upperLimit = 10;
  let avgSpent = 4;
  let isError = false;
  if (appMode === APPMODE.CREATE) {
    if (faction === FACTIONS_NAMES.ANGES) {
      lowerLimit = 2;
      upperLimit = 10;
      avgSpent = 4;
      if (pp_pa_depense < lowerLimit || pp_pa_depense > upperLimit) {
        creationLimitMsg =
          "Les anges doivent dépenser entre 2 et 10 PA dans les PP (en moyenne 4).";
        isError = true;
      }
    } else if (faction === FACTIONS_NAMES.DEMONS) {
      lowerLimit = 2;
      upperLimit = 10;
      avgSpent = 4;
      if (pp_pa_depense < lowerLimit || pp_pa_depense > upperLimit) {
        creationLimitMsg =
          "Les démons doivent dépenser entre 2 et 8 PA dans les PP (en moyenne 4).";
        isError = true;
      }
    }
  }

  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={creationLimitMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={2}>Status</Title>
          </Indicator>
        </Tooltip>
      </Group>
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
            error={creationLimitMsg ? "  " : ""}
            onChange={(val: number) => setCurrentPpPadepense(val)}
          />
        </Card>

        <Blessures force={force} faction={faction} />
      </Group>
    </Stack>
  );
};
