import { useStore } from "../../store/Store";
import { TALENTS_SECONDAIRES_STANDARD_OBJ } from "../../utils/const/TalentStandard";
import { TalentsGenerique } from "./TalentsGenerique";

export const TalentsSecondaires = (props: {}) => {
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
    <TalentsGenerique
      title={"Talents secondaire"}
      currentTalentCollection={currentTalentCollection_secondaire}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_secondaire}
      addCurrentTalent={addCurrentTalent_secondaire}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_secondaire}
      standardTalentCollection={TALENTS_SECONDAIRES_STANDARD_OBJ}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};
