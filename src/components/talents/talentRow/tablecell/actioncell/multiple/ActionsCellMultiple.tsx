import {
  Talent,
  TalentCollection,
} from "../../../../../../utils/const/TalentStandard";
import { AddNewMutiplePopup } from "./AddNewMutiplePopup";
import { Group } from "@mantine/core";

export const ActionsCellMultiple = (props: {
  id: string;
  currentTalentCollection: TalentCollection; // remember those are can be principaux, secondaire, or exotiqie
  standardTalentCollection: TalentCollection;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
}) => {
  return (
    <Group spacing={4} position="left" noWrap>
      <AddNewMutiplePopup
        recordId={props.id}
        currentTalentCollection={props.currentTalentCollection}
        setCurrentTalentNameFragment={props.setCurrentTalentNameFragment}
        addCurrentTalent={props.addCurrentTalent}
        standardTalentCollection={props.standardTalentCollection}
      />
    </Group>
  );
};
