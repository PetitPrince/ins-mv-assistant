import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import {
  Talent,
  TALENT_SPECIALISATION_TYPE_NAME,
  TALENT_TYPE_NAME,
} from "../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import {
  findTalentInCollection,
  talentExistsInCollection,
} from "../../utils/helper/talentHelpers";
import { alphaSort } from "./alphaSort";
import {
  NumberInput,
  Title,
  Text,
  ActionIcon,
  Group,
  Popover,
  TextInput,
  Button,
  Select,
} from "@mantine/core";
import { Stack } from "@mantine/core";
import { IconBug, IconEdit, IconRowInsertTop } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import slugify from "slugify";

const EditNameFragment = (props: {
  hidden: boolean;
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
        <ActionIcon hidden={props.hidden}>
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
  hidden: boolean;
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
        <ActionIcon hidden={props.hidden}>
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

export const TalentsGenerique = (props: {
  title: string;
  currentTalentCollection: Talent[];
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
  setCurrentTalentPaDepense: (talentId: string, val: number) => void;
  standardTalentCollection: Talent[];
}) => {
  const title = props.title;
  const currentTalentCollection = props.currentTalentCollection;
  const setCurrentTalentPaDepense = props.setCurrentTalentPaDepense;
  const addCurrentTalent = props.addCurrentTalent;
  const setCurrentTalentNameFragment = props.setCurrentTalentNameFragment;
  const standardTalentCollection = props.standardTalentCollection;

  const currentPersoCara = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const currentPersoSuperieur = useStore(
    (state) => state.currentPerso.superieur
  );
  const updatePaOrCreateTalent = (talentId: string, updatedPa: number) => {
    if (talentExistsInCollection(currentTalentCollection, talentId)) {
      setCurrentTalentPaDepense(talentId, updatedPa);
    } else {
      const talentInStandardRepo = findTalentInCollection(
        talentId,
        standardTalentCollection
      );
      if (talentInStandardRepo) {
        const newTalent: Talent = {
          ...talentInStandardRepo,
          pa_depense: updatedPa,
        };
        addCurrentTalent(newTalent);
      }
    }
  };

  const talentPrincipauxStandardIds = standardTalentCollection.map((x) => x.id);
  let talentsStandards: Talent[] = standardTalentCollection;
  let toAdd: Talent[] = [];
  for (const onetalent of currentTalentCollection) {
    if (talentPrincipauxStandardIds.includes(onetalent.id)) {
      const idx = talentsStandards.findIndex((x) => x.id === onetalent.id);
      talentsStandards[idx] = onetalent;
    } else {
      toAdd.push(onetalent);
    }
  }
  let rows = talentsStandards.concat(toAdd);
  if (title.includes("exotique")) {
    if (currentPersoSuperieur) {
      rows = rows.filter((x) =>
        x.superieur_exotique.includes(currentPersoSuperieur)
      );
    } else {
      rows = rows.filter((x) => !x.superieur_exotique);
    }
  }
  rows.sort(alphaSort);

  const renderNameColumn = (record: Talent) => {
    let nameFragment;
    if (record.customNameFragment) {
      nameFragment = " (" + record.customNameFragment + ")";
    } else if (record.id.includes("_specifique")) {
      nameFragment = "...";
    } else {
      nameFragment = "";
    }

    return (
      <Text>
        {record.name}
        {nameFragment}
      </Text>
    );
  };
  const renderLevelColumn = (record: Talent) => {
    const talentLevel = calcTalentLevelFromPaDepense(
      record.pa_depense,
      record,
      currentPersoCara
    );

    return <Text>{talentLevel}</Text>;
  };
  const renderPaDepenseColumn = (record: Talent) => {
    return (
      <NumberInput
        value={record.pa_depense}
        onChange={(updatedPa: number) => {
          updatePaOrCreateTalent(record.id, updatedPa);
        }}
      />
    );
  };
  const renderActionColumn = (record: Talent) => {
    const shouldHideEditButton = !(
      record.specialisationType ===
        TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
      record.id.includes("specifique")
    );
    const shouldHideAddButton = !(
      record.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE
    );
    return (
      <Group spacing={4} position="left" noWrap>
        <EditNameFragment
          hidden={shouldHideEditButton}
          recordId={record.id}
          currentTalentCollection={currentTalentCollection}
          setCurrentTalentNameFragment={setCurrentTalentNameFragment}
          addCurrentTalent={addCurrentTalent}
          standardTalentCollection={standardTalentCollection}
        />
        <AddNewMutiple
          hidden={shouldHideAddButton}
          recordId={record.id}
          currentTalentCollection={currentTalentCollection}
          setCurrentTalentNameFragment={setCurrentTalentNameFragment}
          addCurrentTalent={addCurrentTalent}
          standardTalentCollection={standardTalentCollection}
        />
        <ActionIcon color="blue" onClick={() => console.log(record)}>
          <IconBug size={16} />
        </ActionIcon>
      </Group>
    );
  };
  const renderCaraAssocColumn = (record: Talent) => {
    let caraAbbrev;
    switch (record.associatedChara) {
      case CARACTERISTIQUE_NAMES.FORCE:
        caraAbbrev = "Fo";
        break;
      case CARACTERISTIQUE_NAMES.AGILITE:
        caraAbbrev = "Ag";
        break;
      case CARACTERISTIQUE_NAMES.PERCEPTION:
        caraAbbrev = "Pe";
        break;
      case CARACTERISTIQUE_NAMES.VOLONTE:
        caraAbbrev = "Vo";
        break;
      case CARACTERISTIQUE_NAMES.PRESENCE:
        caraAbbrev = "Pr";
        break;
      case CARACTERISTIQUE_NAMES.FOI:
        caraAbbrev = "Fo";
        break;

      default:
        caraAbbrev = "/";
        break;
    }
    return caraAbbrev;
  };

  const submitNewExoticTalent = (event: any) => {
    const newTalentName = event.target.talentName.value;
    let newTalentId = slugify(newTalentName, { lower: true });
    const newTalentCaraAssocie = event.target.cara_associe.value;

    const newTalentSpecialisation = event.target.specialisation.value;

    const newTalent: Talent = {
      name: newTalentName,
      id: newTalentId,
      specialisationType: newTalentSpecialisation,
      associatedChara: newTalentCaraAssocie,
      isInnate: false,
      superieur_exotique: "",
      talentType: TALENT_TYPE_NAME.EXOTIQUE,
      pa_depense: 0,
    };
    addCurrentTalent(newTalent);

    console.log(event);
    event.preventDefault();
  };
  const exotiqueStuff = (
    <form onSubmit={submitNewExoticTalent}>
      <Title order={4}>Nouveau talent</Title>
      <Group>
        <TextInput name="talentName" label="nom" />
        <Select
          label="Spécialisation"
          name="specialisation"
          defaultValue={TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE}
          data={[
            {
              value: TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE,
              label: "Générique",
            },
            {
              value: TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE,
              label: "Spécifique",
            },
            {
              value: TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE,
              label: "Multiple",
            },
          ]}
        />
        <Select
          label="Caractéristique associée"
          name="cara_associe"
          defaultValue={CARACTERISTIQUE_NAMES.AUCUNE}
          data={[
            { value: CARACTERISTIQUE_NAMES.AUCUNE, label: "Aucune" },
            { value: CARACTERISTIQUE_NAMES.FORCE, label: "Force" },
            { value: CARACTERISTIQUE_NAMES.AGILITE, label: "Agilité" },
            { value: CARACTERISTIQUE_NAMES.PERCEPTION, label: "Perception" },
            { value: CARACTERISTIQUE_NAMES.VOLONTE, label: "Volonté" },
            { value: CARACTERISTIQUE_NAMES.PRESENCE, label: "Présence" },
            { value: CARACTERISTIQUE_NAMES.FOI, label: "Foi" },
          ]}
        />
        <Button size="xs" type="submit">
          Ajouter
        </Button>
      </Group>
    </form>
  );

  return (
    <Stack>
      <Title order={3}>{title}</Title>

      <DataTable
        minHeight={150}
        columns={[
          {
            title: "Actions",
            accessor: "actions",
            width: 100,
            render: renderActionColumn,
          },
          {
            title: "Nom",
            accessor: "name",
            width: 150,
            render: renderNameColumn,
          },
          {
            title: "Niveau",
            accessor: "level",
            width: 80,
            render: renderLevelColumn,
          },
          {
            title: "PA Dépensé",
            accessor: "pa_depense",
            width: 100,
            render: renderPaDepenseColumn,
          },
          {
            title: "Caractéristique associée",
            accessor: "associatedChara",
            render: renderCaraAssocColumn,
          },
        ]}
        records={rows}
      />
      {title.includes("exotique") ? exotiqueStuff : ""}
    </Stack>
  );
};
