import {
  Talent,
  TalentCollection,
} from "../../../../../../utils/const/TalentStandard";
import { ActionIcon, Button, Popover, TextInput } from "@mantine/core";
import { IconEdit } from "@tabler/icons";

export const EditNameFragmentPopup = (props: {
  recordId: string;
  currentTalentCollection: TalentCollection;
  standardTalentCollection: TalentCollection;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
}) => {
  const setCurrentTalentNameFragment = props.setCurrentTalentNameFragment;
  const addCurrentTalent = props.addCurrentTalent;

  const updateNameFragmentOrCreateTalentPrincipal = (
    talentId: string,
    nameFragment: string
  ) => {
    if (Object.hasOwn(props.currentTalentCollection, talentId)) {
      setCurrentTalentNameFragment(talentId, nameFragment);
    } else {
      const talentInStandardRepo = props.standardTalentCollection[talentId];
      if (talentInStandardRepo) {
        const newTalent: Talent = {
          ...talentInStandardRepo,
          customNameFragment: nameFragment,
        };
        addCurrentTalent(newTalent);
      }
    }
  };

  return (
    <Popover width={300} trapFocus position="bottom" shadow="md">
      <Popover.Target>
        <ActionIcon>
          <IconEdit size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <form
          onSubmit={(event: any) => {
            const talentNameFragment = event.target.talentNameFragment.value;
            updateNameFragmentOrCreateTalentPrincipal(
              props.recordId,
              talentNameFragment
            );
            event.preventDefault();
          }}
        >
          <TextInput
            label="Nom de la spécialisation"
            name="talentNameFragment"
            size="xs"
          />
          <Button type="submit">Changer</Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
