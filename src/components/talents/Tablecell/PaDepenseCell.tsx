import { APPMODE } from "../../../APPMODE";
import { useStore } from "../../../store/Store";
import { FACTIONS_NAMES } from "../../../utils/const/Factions";
import { CaracteristiquesSet } from "../../../utils/const/Personnage";
import { Talent } from "../../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../../utils/helper/getTalentLevel";
import { NumberInput } from "@mantine/core";

export const PaDepenseCell = (props: {
  pa_depense: number;
  id: string;
  talent: Talent;
  cara: CaracteristiquesSet;
  updatePaOrCreateTalent: (id: string, updatedPa: number) => void;
  faction: FACTIONS_NAMES;
}) => {
  const { pa_depense, id, talent, cara, updatePaOrCreateTalent, faction } =
    props;
  const talentLevel = calcTalentLevelFromPaDepense(pa_depense, talent, cara);

  const appMode = useStore((state) => state.appMode);

  let errorMsgs: string[] = [];

  if (
    appMode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.ANGES &&
    talentLevel > 7.5
  ) {
    // TODO: no restriction after the perso is created
    errorMsgs.push("Niveau maximum pour les anges à la création est de 7.5");
  }
  if (
    appMode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.DEMONS &&
    talentLevel > 70
  ) {
    errorMsgs.push("Niveau maximum pour les démons à la création est de 7");
  }
  const errorMsg = errorMsgs.join(" + ");
  return (
    <NumberInput
      value={pa_depense}
      error={errorMsg}
      onChange={(updatedPa: number) => {
        updatePaOrCreateTalent(id, updatedPa);
      }}
    />
  );
};
