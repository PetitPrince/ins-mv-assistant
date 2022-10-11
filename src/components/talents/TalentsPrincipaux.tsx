import { useStore } from "../../store/Store";
import { TALENTS_PRINCIPAUX_STANDARD_OBJ } from "../../utils/const/TalentStandard";
import { TalentsGenerique } from "./TalentsGenerique";

export const TalentsPrincipaux = (props: {}) => {
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
    <TalentsGenerique
      title={"Talents principaux"}
      currentTalentCollection={currentTalentCollection_principal}
      setCurrentTalentNameFragment={setCurrentTalentNameFragment_principal}
      addCurrentTalent={addCurrentTalent_principal}
      setCurrentTalentPaDepense={setCurrentTalentPaDepense_principal}
      standardTalentCollection={TALENTS_PRINCIPAUX_STANDARD_OBJ}
      currentPersoCara={currentPersoCara}
      currentPersoSuperieur={currentPersoSuperieur}
      faction={faction}
    />
  );
};
