import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { CaracteristiquesSet } from "../../utils/const/Personnage";
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
import React from "react";
import slugify from "slugify";

function findMatchingStandardTalentInCollection(
  talentCollection: Talent[],
  standardTalentCollection: Talent[]
) {
  const talentPrincipauxStandardIds = standardTalentCollection.map((x) => x.id);
  let toAdd: Talent[] = [];
  for (const onetalent of talentCollection) {
    if (talentPrincipauxStandardIds.includes(onetalent.id)) {
      const idx = standardTalentCollection.findIndex(
        (x) => x.id === onetalent.id
      );
      standardTalentCollection[idx] = onetalent;
    } else {
      toAdd.push(onetalent);
    }
  }
  return toAdd;
}

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
  currentPersoCara: CaracteristiquesSet;
  currentPersoSuperieur: string;
}) => {
  const title = props.title;
  const currentTalentCollection = props.currentTalentCollection;
  const setCurrentTalentPaDepense = props.setCurrentTalentPaDepense;
  const addCurrentTalent = props.addCurrentTalent;
  const setCurrentTalentNameFragment = props.setCurrentTalentNameFragment;
  const standardTalentCollection = props.standardTalentCollection;

  const currentPersoCara = props.currentPersoCara;
  const currentPersoSuperieur = props.currentPersoSuperieur;
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

  let talentsStandards: Talent[] = standardTalentCollection;
  let updatedStandardTalent: Talent[] = findMatchingStandardTalentInCollection(
    currentTalentCollection,
    standardTalentCollection
  );
  let rows = talentsStandards.concat(updatedStandardTalent);

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
  const RenderPaDepenseColumnMem = React.memo((props: { record: Talent }) => {
    return (
      <NumberInput
        value={props.record.pa_depense}
        onChange={(updatedPa: number) => {
          updatePaOrCreateTalent(props.record.id, updatedPa);
        }}
      />
    );
  });

  const renderPaDepenseColumn = (record: Talent) => {
    return <RenderPaDepenseColumnMem record={record} />;
  };
  const renderActionColumn = (record: Talent) => {
    const shouldShowEditButton =
      record.specialisationType ===
        TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
      record.id.includes("specifique");
    const editNameFragment = shouldShowEditButton ? (
      <EditNameFragment
        recordId={record.id}
        currentTalentCollection={currentTalentCollection}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment}
        addCurrentTalent={addCurrentTalent}
        standardTalentCollection={standardTalentCollection}
      />
    ) : null;

    const shouldShowAddButton =
      record.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE;
    const addNewMultiple = shouldShowAddButton ? (
      <AddNewMutiple
        recordId={record.id}
        currentTalentCollection={currentTalentCollection}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment}
        addCurrentTalent={addCurrentTalent}
        standardTalentCollection={standardTalentCollection}
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
