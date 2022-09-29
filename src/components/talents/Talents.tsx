import { useStore } from "../../store/Store";
import {
  TalentStandard,
  TALENTS_EXOTIQUES_STANDARD2,
  TALENTS_PRINCIPAUX_STANDARD2,
  TALENTS_SECONDAIRES_STANDARD2,
} from "../../utils/const/TalentStandard";
import "./TalentsGenerique";
import { Talents2Component } from "./TalentsGenerique";
import { Title } from "@mantine/core";
import { Stack } from "@mantine/core";

export interface TalentDisplayRow extends TalentStandard {
  level: number | undefined;
  pa_depense: number;
}

export const Talents = (props: {}) => {
  const currentTalentCollection_principal = useStore(
    (state) => state.currentPerso.talents2.principaux
  );
  const setCurrentTalentPaDepense_principal = useStore(
    (state) => state.setCurrentTalentPrincipal2PaDepense
  );
  const addCurrentTalent_principal = useStore(
    (state) => state.addCurrentTalentPrincipal2
  );
  const setCurrentTalentNameFragment_principal = useStore(
    (state) => state.setCurrentTalentPrincipal2NameFragment
  );

  const currentTalentCollection_secondaire = useStore(
    (state) => state.currentPerso.talents2.secondaires
  );
  const setCurrentTalentPaDepense_secondaire = useStore(
    (state) => state.setCurrentTalentSecondaire2PaDepense
  );
  const addCurrentTalent_secondaire = useStore(
    (state) => state.addCurrentTalentSecondaire2
  );
  const setCurrentTalentNameFragment_secondaire = useStore(
    (state) => state.setCurrentTalentSecondaire2NameFragment
  );

  const currentTalentCollection_exotique = useStore(
    (state) => state.currentPerso.talents2.exotiques
  );
  const setCurrentTalentPaDepense_exotique = useStore(
    (state) => state.setCurrentTalentExotique2PaDepense
  );
  const addCurrentTalent_exotique = useStore(
    (state) => state.addCurrentTalentExotique2
  );
  const setCurrentTalentNameFragment_exotique = useStore(
    (state) => state.setCurrentTalentExotique2NameFragment
  );

  return (
    <Stack>
      <Title order={2}>Talents</Title>
      {/* <Group sx={{ "align-items": "flex-start" }}> */}
      <Talents2Component
        title={"Talents principaux"}
        currentTalentCollection={currentTalentCollection_principal}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment_principal}
        addCurrentTalent={addCurrentTalent_principal}
        setCurrentTalentPaDepense={setCurrentTalentPaDepense_principal}
        standardTalentCollection={TALENTS_PRINCIPAUX_STANDARD2}
      />

      <Talents2Component
        title={"Talents secondaire"}
        currentTalentCollection={currentTalentCollection_secondaire}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment_secondaire}
        addCurrentTalent={addCurrentTalent_secondaire}
        setCurrentTalentPaDepense={setCurrentTalentPaDepense_secondaire}
        standardTalentCollection={TALENTS_SECONDAIRES_STANDARD2}
      />
      <Talents2Component
        title={"Talents exotiques"}
        currentTalentCollection={currentTalentCollection_exotique}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment_exotique}
        addCurrentTalent={addCurrentTalent_exotique}
        setCurrentTalentPaDepense={setCurrentTalentPaDepense_exotique}
        standardTalentCollection={TALENTS_EXOTIQUES_STANDARD2}
      />
    </Stack>
  );
};
