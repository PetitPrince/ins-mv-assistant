import {
  Talent,
  TalentCollection,
} from "../../../../../../utils/const/TalentStandard";
import { ActionIcon, Button, Popover, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconRowInsertTop } from "@tabler/icons";
import slugify from "slugify";

export const AddNewMutiplePopup = (props: {
  recordId: string;
  currentTalentCollection: TalentCollection;
  standardTalentCollection: TalentCollection;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
}) => {
  const addCurrentTalent = props.addCurrentTalent;
  const updateNameFragmentOrCreateTalentPrincipal = (
    talentId: string,
    nameFragment: string
  ) => {
    if (Object.hasOwn(props.currentTalentCollection, talentId)) {
    } else {
      const talentInStandardRepo = props.standardTalentCollection[talentId];
      if (talentInStandardRepo) {
        const newTalent: Talent = {
          ...talentInStandardRepo,
          customNameFragment: nameFragment,
          id:
            talentInStandardRepo.id +
            "_" +
            slugify(nameFragment, { lower: true }),
        };
        addCurrentTalent(newTalent);
      } else {
        showNotification({
          message: "Le talent existe déjà !",
          color: "red",
        });
      }
    }
  };

  return (
    <Popover width={300} trapFocus position="bottom" shadow="md">
      <Popover.Target>
        <ActionIcon>
          <IconRowInsertTop size={16} />
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
            label="Ajouter un nouveau talent (d'un talent multiple)"
            name="talentNameFragment"
            size="xs"
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
