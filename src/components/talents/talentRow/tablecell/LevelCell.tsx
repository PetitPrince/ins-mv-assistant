import { CaracteristiquesSet } from "../../../../utils/const/Personnage";
import { Talent } from "../../../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../../../utils/helper/getTalentLevel";
import { Text } from "@mantine/core";

export const LevelCell = (props: {
  pa_depense: number;
  talent: Talent;
  cara: CaracteristiquesSet;
}) => {
  const { pa_depense, talent, cara } = props;
  const talentLevel = calcTalentLevelFromPaDepense(pa_depense, talent, cara);

  return <Text>{talentLevel}</Text>;
};
