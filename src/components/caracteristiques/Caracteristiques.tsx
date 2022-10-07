import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { Blessures } from "../status/Blessures";
import { CaracteristiqueCard } from "./CaracteristiqueCard";
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
} from "@mantine/core";

export const Caracteristiques = (props: {}) => {
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
  const availablePa = useStore((state) => state.paAfterBilling);
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

  const force_niveau = calcCaracteristiqueLevelFromPaDepense(force.pa_depense);
  const agilite_niveau = calcCaracteristiqueLevelFromPaDepense(
    agilite.pa_depense
  );
  const perception_niveau = calcCaracteristiqueLevelFromPaDepense(
    perception.pa_depense
  );
  const volonte_niveau = calcCaracteristiqueLevelFromPaDepense(
    volonte.pa_depense
  );
  const presence_niveau = calcCaracteristiqueLevelFromPaDepense(
    presence.pa_depense
  );
  const foi_niveau = calcCaracteristiqueLevelFromPaDepense(foi.pa_depense);
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
  let avgSpent = 33;
  let isError = false;
  if (appMode === APPMODE.CREATE) {
    if (faction === FACTIONS_NAMES.ANGES) {
      lowerLimit = 20;
      upperLimit = 50;
      avgSpent = 40;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les anges doivent dépenser entre 20 et 50 PA dans les caractéristiques (en moyenne 40).";
        isError = true;
      }
    } else if (faction === FACTIONS_NAMES.DEMONS) {
      lowerLimit = 16;
      upperLimit = 40;
      avgSpent = 24;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les démons doivent dépenser entre 16 et 40 PA dans les caractéristiques (en moyenne 24).";
        isError = true;
      }
    }
  }

  const pfMax = force_niveau + volonte_niveau;

  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={creationLimitMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={2}>Caractéristiques</Title>
          </Indicator>
        </Tooltip>
      </Group>

      <Group>
        <CaracteristiqueCard
          caracName="Force"
          caracNiveau={force_niveau}
          og_pa_depense={og_force.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={force.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FORCE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Agilité"
          caracNiveau={agilite_niveau}
          og_pa_depense={og_agilite.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={agilite.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.AGILITE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Perception"
          caracNiveau={perception_niveau}
          og_pa_depense={og_perception.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={perception.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PERCEPTION}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Volonté"
          caracNiveau={volonte_niveau}
          og_pa_depense={og_volonte.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={volonte.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.VOLONTE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Présence"
          caracNiveau={presence_niveau}
          og_pa_depense={og_presence.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={presence.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PRESENCE}
          currentGrade={currentGrade}
        />
        <CaracteristiqueCard
          caracName="Foi"
          caracNiveau={foi_niveau}
          og_pa_depense={og_foi.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={foi.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FOI}
          currentGrade={currentGrade}
        />
      </Group>

      <Group sx={{ "align-items": "flex-start" }}>
        <Stack>
          <Title order={5}> PP</Title>
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
        </Stack>

        <Stack>
          <Title order={5}> Seuils de blessures | PF Maxium {pfMax} </Title>

          <Blessures force={force_niveau} faction={faction} />
        </Stack>
      </Group>
    </Stack>
  );
};
export const calcPPFromPaDepense = (
  volonte: number,
  foi: number,
  pa_depense: number
) => {
  return volonte + foi + pa_depense;
};
