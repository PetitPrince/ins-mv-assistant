import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { CaracteristiqueCard } from "./CaracteristiqueCard";
import { Stack, Group, Title, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

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

  const storeCurrentCaracteristiquesPaDepense = useStore(
    (state) => state.setCurrentCaracteristiquesPaDepense
  );
  const setPaDepense = (val: number, cara: CARACTERISTIQUE_NAMES) => {
    storeCurrentCaracteristiquesPaDepense(val, cara);
  };
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

  const sum =
    force.pa_depense +
    agilite.pa_depense +
    perception.pa_depense +
    volonte.pa_depense +
    presence.pa_depense +
    foi.pa_depense;
  let errMsg = "";
  if (faction === FACTIONS_NAMES.ANGES && (sum < 20 || sum > 50)) {
    errMsg =
      "Les anges doivent dépenser entre 20 et 50 PA dans les caractéristiques (en moyenne 40).";
  }
  if (faction === FACTIONS_NAMES.DEMONS && (sum < 16 || sum > 40)) {
    errMsg =
      "Les démons doivent dépenser entre 16 et 40 PA dans les caractéristiques (en moyenne 24).";
  }
  return (
    <Stack>
      <Title order={2}>Caractéristiques</Title>
      {errMsg ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Limite de dépense"
          color="yellow"
        >
          {errMsg}
        </Alert>
      ) : (
        ""
      )}
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
    </Stack>
  );
};
