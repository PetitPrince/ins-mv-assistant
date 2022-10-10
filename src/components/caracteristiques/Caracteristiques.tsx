import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { Blessures } from "./Blessures";
import { CaracteristiqueCard } from "./CaracteristiqueCard";
import { calcPPFromPaDepense } from "./helper_calcPPFromPaDepense";
import {
  Stack,
  Group,
  Title,
  Indicator,
  Tooltip,
  Card,
  Center,
  NumberInput,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";

export const Caracteristiques = (props: {}) => {
  const theme = useMantineTheme();
  const { force, agilite, perception, volonte, presence, foi } = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const {
    force: og_force,
    agilite: og_agilite,
    perception: og_perception,
    volonte: og_volonte,
    presence: og_presence,
    foi: og_foi,
  } = useStore((state) => state.originalPerso.caracteristiques);
  const currentGrade = useStore((state) => state.currentPerso.grade);
  const faction = useStore((state) => state.currentPerso.faction);
  const appMode = useStore((state) => state.appMode);
  const storeCurrentCaracteristiquesPaDepense = useStore(
    (state) => state.setCurrentCaracteristiquesPaDepense
  );
  const setPaDepense = (val: number, cara: CARACTERISTIQUE_NAMES) => {
    storeCurrentCaracteristiquesPaDepense(val, cara);
  };
  const pp_pa_depense = useStore((state) => state.currentPerso.pp_pa_depense);
  const setCurrentPpPadepense = useStore(
    (state) => state.setCurrentPpPadepense
  );
  const [
    force_niveau,
    agilite_niveau,
    perception_niveau,
    volonte_niveau,
    presence_niveau,
    foi_niveau,
  ] = [
    force.pa_depense,
    agilite.pa_depense,
    perception.pa_depense,
    volonte.pa_depense,
    presence.pa_depense,
    foi.pa_depense,
  ].map(calcCaracteristiqueLevelFromPaDepense);

  const ppMax = calcPPFromPaDepense(volonte_niveau, foi_niveau, pp_pa_depense);

  const sum =
    force.pa_depense +
    agilite.pa_depense +
    perception.pa_depense +
    volonte.pa_depense +
    presence.pa_depense +
    foi.pa_depense;
  let creationLimitMsg = "";
  let lowerLimit = 16;
  let upperLimit = 50;
  // let avgSpent = 33;
  let isError = false;
  if (appMode === APPMODE.CREATE) {
    if (faction === FACTIONS_NAMES.ANGES) {
      lowerLimit = 20;
      upperLimit = 50;
      // avgSpent = 40;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les anges doivent dépenser entre 20 et 50 PA dans les caractéristiques (en moyenne 40).";
        isError = true;
      }
    } else if (faction === FACTIONS_NAMES.DEMONS) {
      lowerLimit = 16;
      upperLimit = 40;
      // avgSpent = 24;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les démons doivent dépenser entre 16 et 40 PA dans les caractéristiques (en moyenne 24).";
        isError = true;
      }
    }
  }

  const pfMax = force_niveau + volonte_niveau;
  const pfComputationDisplay = force_niveau + " + " + volonte_niveau;
  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={creationLimitMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={2}>Caractéristiques et valeurs annexes</Title>
          </Indicator>
        </Tooltip>
      </Group>

      <Group>
        <CaracteristiqueCard
          caracName="Force"
          caracNiveau={force_niveau}
          og_pa_depense={og_force.pa_depense}
          cara_pa_depense={force.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FORCE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Agilité"
          caracNiveau={agilite_niveau}
          og_pa_depense={og_agilite.pa_depense}
          cara_pa_depense={agilite.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.AGILITE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Perception"
          caracNiveau={perception_niveau}
          og_pa_depense={og_perception.pa_depense}
          cara_pa_depense={perception.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PERCEPTION}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Volonté"
          caracNiveau={volonte_niveau}
          og_pa_depense={og_volonte.pa_depense}
          cara_pa_depense={volonte.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.VOLONTE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Présence"
          caracNiveau={presence_niveau}
          og_pa_depense={og_presence.pa_depense}
          cara_pa_depense={presence.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PRESENCE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Foi"
          caracNiveau={foi_niveau}
          og_pa_depense={og_foi.pa_depense}
          cara_pa_depense={foi.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FOI}
          currentGrade={currentGrade}
        />
      </Group>

      <Group sx={{ "align-items": "flex-start" }}>
        <Stack>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            sx={{ backgroundColor: theme.colors.blue[1] }}
          >
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
        </Stack>
        <Stack>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            sx={{ backgroundColor: theme.colors.red[1] }}
          >
            <Card.Section>
              <Center>
                <Text size="xs">PF</Text>
              </Center>
              <Center>
                <Title>{pfMax}</Title>
              </Center>
            </Card.Section>
            <TextInput
              size="sm"
              disabled
              styles={{ input: { width: 75, textAlign: "center" } }}
              label="PA dépensé"
              value={pfComputationDisplay}
              error={creationLimitMsg ? "  " : ""}
            />
          </Card>
        </Stack>

        <Stack>
          <Title order={5}> Seuils de blessures </Title>
          <Blessures force={force_niveau} faction={faction} />
        </Stack>
      </Group>
    </Stack>
  );
};
