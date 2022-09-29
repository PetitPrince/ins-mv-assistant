import {
  Talent,
  TALENT_SPECIALISATION_TYPE_NAME,
} from "../../../utils/const/TalentStandard";
import {
  findTalentInCollection,
  talentExistsInCollection,
} from "../../../utils/helper/talentHelpers";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Popover,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconRowInsertTop } from "@tabler/icons";
import slugify from "slugify";

export const ActionsCell = (props: {
  specialisationType: TALENT_SPECIALISATION_TYPE_NAME;
  id: string;
  currentTalentCollection: Talent[];
  standardTalentCollection: Talent[];
  setCurrentTalentPaDepense: (talentId: string, val: number) => void;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
}) => {
  const shouldShowEditButton =
    props.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
    props.id.includes("specifique");
  const editNameFragment = shouldShowEditButton ? (
    <EditNameFragment
      recordId={props.id}
      currentTalentCollection={props.currentTalentCollection}
      setCurrentTalentNameFragment={props.setCurrentTalentNameFragment}
      addCurrentTalent={props.addCurrentTalent}
      standardTalentCollection={props.standardTalentCollection}
    />
  ) : null;

  const shouldShowAddButton =
    props.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE;
  const addNewMultiple = shouldShowAddButton ? (
    <AddNewMutiple
      recordId={props.id}
      currentTalentCollection={props.currentTalentCollection}
      setCurrentTalentNameFragment={props.setCurrentTalentNameFragment}
      addCurrentTalent={props.addCurrentTalent}
      standardTalentCollection={props.standardTalentCollection}
    />
  ) : null;

  return (
    <Group spacing={4} position="left" noWrap>
      {editNameFragment}
      {addNewMultiple}
      {/* 
    <ActionIcon color="blue" onClick={() => console.log(record)}>
      <IconBug size={16} />
    </ActionIcon> */}
    </Group>
  );
};

const EditNameFragment = (props: {
  recordId: string;
  currentTalentCollection: Talent[];
  standardTalentCollection: Talent[];
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
    if (talentExistsInCollection(props.currentTalentCollection, talentId)) {
      setCurrentTalentNameFragment(talentId, nameFragment);
    } else {
      const talentInStandardRepo = findTalentInCollection(
        talentId,
        props.standardTalentCollection
      );
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

const AddNewMutiple = (props: {
  recordId: string;
  currentTalentCollection: Talent[];
  standardTalentCollection: Talent[];
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
    if (talentExistsInCollection(props.currentTalentCollection, talentId)) {
    } else {
      const talentInStandardRepo = findTalentInCollection(
        talentId,
        props.standardTalentCollection
      );
      if (talentInStandardRepo) {
        const newTalent: Talent = {
          ...talentInStandardRepo,
          customNameFragment: nameFragment,
          id: "hobby_" + slugify(nameFragment, { lower: true }),
        };
        addCurrentTalent(newTalent);
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
            label="Nom du nouveau talent"
            name="talentNameFragment"
            size="xs"
          />
          <Button type="submit">Changer</Button>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
