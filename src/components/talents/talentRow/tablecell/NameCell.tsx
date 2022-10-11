import { CaracteristiquesSet } from "../../../../utils/const/Personnage";
import { Talent } from "../../../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../../../utils/helper/getTalentLevel";
import { Text } from "@mantine/core";

export const NameCell = (props: {
  name: string;
  id: string;
  customNameFragment?: string;
}) => {
  const { name, id, customNameFragment } = props;
  let nameFragment;
  if (customNameFragment) {
    nameFragment = " (" + customNameFragment + ")";
  } else if (id.includes("_specifique")) {
    nameFragment = "...";
  } else {
    nameFragment = "";
  }

  return (
    <Text>
      {name}
      {nameFragment}
    </Text>
  );
};
