import { INSMVNumberInput } from "../../App";
import { getCaracteristiqueLevel, useStore } from "../../store/Store";
import { INSMVCaraPaDepenseNumberInput } from "./INSMVCaraPaDepenseNumberInput";
import { Stack, Group, Title } from "@mantine/core";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";

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
        <Group spacing="xs">
          <INSMVNumberInput
            label="Force"
            hideControls
            value={force_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_force.pa_depense}
            availablePa={availablePa}
            label="Force - PA dépensé"
            value={force.pa_depense}
            onChange={(val: number) =>
              setPaDepense(val, CARACTERISTIQUE_NAMES.FORCE)
            }
          />
        </Group>
        <Group spacing="xs">
          <INSMVNumberInput
            label="Agilite"
            hideControls
            value={agilite_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_agilite.pa_depense}
            availablePa={availablePa}
            label="Agilite - PA dépensé"
            value={agilite.pa_depense}
            onChange={(val: number) =>
              setPaDepense(val, CARACTERISTIQUE_NAMES.AGILITE)
            }
          />
        </Group>
        <Group spacing="xs">
          <INSMVNumberInput
            label="Perception"
            hideControls
            value={perception_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_perception.pa_depense}
            availablePa={availablePa}
            label="Perception - PA dépensé"
            value={perception.pa_depense}
            onChange={(val: number) =>
              setPaDepense(val, CARACTERISTIQUE_NAMES.PERCEPTION)
            }
          />
        </Group>
        <Group spacing="xs">
          <INSMVNumberInput
            label="Volonté"
            hideControls
            value={volonte_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_volonte.pa_depense}
            availablePa={availablePa}
            label="Volonté - PA dépensé"
            value={volonte.pa_depense}
            onChange={(val: number) =>
              setPaDepense(val, CARACTERISTIQUE_NAMES.VOLONTE)
            }
          />
        </Group>
        <Group spacing="xs">
          <INSMVNumberInput
            label="Présence"
            hideControls
            value={presence_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_presence.pa_depense}
            availablePa={availablePa}
            label="Présence - PA dépensé"
            value={presence.pa_depense}
            onChange={(val: number) =>
              setPaDepense(val, CARACTERISTIQUE_NAMES.PRESENCE)
            }
          />
        </Group>
        <Group spacing="xs">
          <INSMVNumberInput
            label="Foi"
            hideControls
            value={foi_niveau}
            readOnly
            variant="unstyled"
          />
          <INSMVCaraPaDepenseNumberInput
            initialValue={og_foi.pa_depense}
            availablePa={availablePa}
            label="Foi - PA dépensé"
            value={foi.pa_depense}
            onChange={(val: number) => setPaDepense(val, CARACTERISTIQUE_NAMES.FOI)}
          />
        </Group>
      </Group>
    </Stack>
  );
};
