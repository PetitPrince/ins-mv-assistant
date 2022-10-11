import {
  Talent,
  TalentCollection,
  TALENT_SPECIALISATION_TYPE_NAME,
} from "../../../../../../utils/const/TalentStandard";
import { EditNameFragmentPopup } from "./EditNameFragmentPopup";
import { Group } from "@mantine/core";

export const ActionsCellSpecifique = (props: {
  specialisationType: TALENT_SPECIALISATION_TYPE_NAME;
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
      <EditNameFragmentPopup
        recordId={props.id}
        currentTalentCollection={props.currentTalentCollection}
        setCurrentTalentNameFragment={props.setCurrentTalentNameFragment}
        addCurrentTalent={props.addCurrentTalent}
        standardTalentCollection={props.standardTalentCollection}
      />
    </Group>
  );
};
