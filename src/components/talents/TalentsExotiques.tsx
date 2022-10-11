import { useStore } from "../../store/Store";
import { TALENTS_EXOTIQUES_STANDARD_OBJ } from "../../utils/const/TalentStandard";
import { TalentsGenerique } from "./TalentsGenerique";

export const TalentsExotiques = (props: {}) => {
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
    <TalentsGenerique
      title={"Talents exotiques"}
      currentTalentCollection={currentTalentCollection_exotique}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_exotique}
      addCurrentTalent={addCurrentTalent_exotique}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_exotique}
      standardTalentCollection={TALENTS_EXOTIQUES_STANDARD_OBJ}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};
