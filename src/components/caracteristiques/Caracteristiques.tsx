import { INSMVNumberInput } from "../../App";
import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { Caracteristique } from "../../utils/const/Personnage";
import { getCaracteristiqueLevel } from "../../utils/helper/getCaracteristiqueLevel";
import { CaracteristiqueCard } from "./CaracteristiqueCard";
import { INSMVCaraPaDepenseNumberInput } from "./INSMVCaraPaDepenseNumberInput";
import { Stack, Group, Title, Space, Container } from "@mantine/core";

export const Caracteristiques = (props: {}) => {
  const currentPerso = useStore((state) => state.currentPerso);
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

  const storeCurrentCaracteristiquesPaDepense = useStore(
    (state) => state.setCurrentCaracteristiquesPaDepense
  );
  const setPaDepense = (val: number, cara: CARACTERISTIQUE_NAMES) => {
    storeCurrentCaracteristiquesPaDepense(val, cara);
  };
  const force_niveau = getCaracteristiqueLevel(currentPerso, "force");
  const agilite_niveau = getCaracteristiqueLevel(currentPerso, "agilite");
  const perception_niveau = getCaracteristiqueLevel(currentPerso, "perception");
  const volonte_niveau = getCaracteristiqueLevel(currentPerso, "volonte");
  const presence_niveau = getCaracteristiqueLevel(currentPerso, "presence");
  const foi_niveau = getCaracteristiqueLevel(currentPerso, "foi");

  return (
    <Stack>
      <Title order={2}>Caractéristiques</Title>
      <Group>
        <CaracteristiqueCard
          caracName="Force"
          caracNiveau={force_niveau}
          og_pa_depense={og_force.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={force.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FORCE}
        />
        <CaracteristiqueCard
          caracName="Agilité"
          caracNiveau={agilite_niveau}
          og_pa_depense={og_agilite.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={agilite.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.AGILITE}
        />
        <CaracteristiqueCard
          caracName="Perception"
          caracNiveau={perception_niveau}
          og_pa_depense={og_perception.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={perception.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PERCEPTION}
        />
        <CaracteristiqueCard
          caracName="Volonté"
          caracNiveau={volonte_niveau}
          og_pa_depense={og_volonte.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={volonte.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.VOLONTE}
        />
        <CaracteristiqueCard
          caracName="Présence"
          caracNiveau={presence_niveau}
          og_pa_depense={og_presence.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={presence.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.PRESENCE}
        />
        <CaracteristiqueCard
          caracName="Foi"
          caracNiveau={foi_niveau}
          og_pa_depense={og_foi.pa_depense}
          availablePa={availablePa}
          cara_pa_depense={foi.pa_depense}
          setPaDepense={setPaDepense}
          caraNameEnum={CARACTERISTIQUE_NAMES.FOI}
        />
      </Group>
    </Stack>
  );
};
