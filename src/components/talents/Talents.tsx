import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import {
  TALENTS_EXOTIQUES_STANDARD,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_SECONDAIRES_STANDARD,
} from "../../utils/const/TalentStandard";
import { LimitSliderThingy } from "../limitSliderThingy";
import "./TalentsGenerique";
import { TalentsGenerique } from "./TalentsGenerique";
import { TalentsGenerique2 } from "./TalentsGenerique2";
import { Alert, Group, Indicator, Title, Tooltip } from "@mantine/core";
import { Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

const TalentsPrincipaux = (props: {}) => {
  const faction = useStore((state) => state.currentPerso.faction);
  const currentTalentCollection_principal = useStore(
    (state) => state.currentPerso.talents.principaux
  );

  const setCurrentTalentPaDepense_principal = useStore(
    (state) => state.setCurrentTalentPrincipalPaDepense
  );
  const addCurrentTalent_principal = useStore(
    (state) => state.addCurrentTalentPrincipal
  );
  const setCurrentTalentNameFragment_principal = useStore(
    (state) => state.setCurrentTalentPrincipalNameFragment
  );
  const currentPersoCara = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const currentPersoSuperieur = useStore(
    (state) => state.currentPerso.superieur
  );
  return (
    <TalentsGenerique2
      title={"Talents principaux"}
      currentTalentCollection={currentTalentCollection_principal}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_principal}
      addCurrentTalent={addCurrentTalent_principal}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_principal}
      standardTalentCollection={TALENTS_PRINCIPAUX_STANDARD}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};

const TalentsSecondaires = (props: {}) => {
  const faction = useStore((state) => state.currentPerso.faction);
  const currentTalentCollection_secondaire = useStore(
    (state) => state.currentPerso.talents.secondaires
  );
  const setCurrentTalentPaDepense_secondaire = useStore(
    (state) => state.setCurrentTalentSecondairePaDepense
  );
  const addCurrentTalent_secondaire = useStore(
    (state) => state.addCurrentTalentSecondaire
  );
  const setCurrentTalentNameFragment_secondaire = useStore(
    (state) => state.setCurrentTalentSecondaireNameFragment
  );
  const currentPersoCara = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const currentPersoSuperieur = useStore(
    (state) => state.currentPerso.superieur
  );
  return (
    <TalentsGenerique2
      title={"Talents secondaire"}
      currentTalentCollection={currentTalentCollection_secondaire}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_secondaire}
      addCurrentTalent={addCurrentTalent_secondaire}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_secondaire}
      standardTalentCollection={TALENTS_SECONDAIRES_STANDARD}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};

const TalentsExotiques = (props: {}) => {
  const faction = useStore((state) => state.currentPerso.faction);
  const currentTalentCollection_exotique = useStore(
    (state) => state.currentPerso.talents.exotiques
  );
  const setCurrentTalentPaDepense_exotique = useStore(
    (state) => state.setCurrentTalentExotiquePaDepense
  );
  const addCurrentTalent_exotique = useStore(
    (state) => state.addCurrentTalentExotique
  );
  const setCurrentTalentNameFragment_exotique = useStore(
    (state) => state.setCurrentTalentExotiqueNameFragment
  );
  const currentPersoCara = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const currentPersoSuperieur = useStore(
    (state) => state.currentPerso.superieur
  );

  return (
    <TalentsGenerique2
      title={"Talents exotiques"}
      currentTalentCollection={currentTalentCollection_exotique}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_exotique}
      addCurrentTalent={addCurrentTalent_exotique}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_exotique}
      standardTalentCollection={TALENTS_EXOTIQUES_STANDARD}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};

export const Talents = (props: {}) => {
  const appMode = useStore((state) => state.appMode);
  const talents = useStore((state) => state.currentPerso.talents);
  const faction = useStore((state) => state.currentPerso.faction);
  const paDepenseTalentsPrincipaux = talents.principaux.reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );
  const paDepenseTalentsSecondaire = talents.secondaires.reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );
  const paDepenseTalentsExotique = talents.exotiques.reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );

  const sum =
    paDepenseTalentsPrincipaux +
    paDepenseTalentsSecondaire +
    paDepenseTalentsExotique;

  let creationLimitMsg = "";
  let lowerLimit = 20;
  let upperLimit = 50;
  let avgSpent = 23;
  let isError = false;
  if (appMode === APPMODE.CREATE) {
    if (faction === FACTIONS_NAMES.ANGES) {
      lowerLimit = 25;
      upperLimit = 50;
      avgSpent = 32;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les anges doivent dépenser entre 25 et 50 PA dans les talents (en moyenne 32).";
        isError = true;
      }
    } else if (faction === FACTIONS_NAMES.DEMONS) {
      lowerLimit = 20;
      upperLimit = 40;
      avgSpent = 28;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les démons doivent dépenser entre 20 et 40 PA dans les talents (en moyenne 28).";
        isError = true;
      }
    }
  }

  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={creationLimitMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={2}>Talents</Title>
          </Indicator>
        </Tooltip>
      </Group>
      <TalentsPrincipaux />
      <TalentsSecondaires />
      <TalentsExotiques />
    </Stack>
  );
};
