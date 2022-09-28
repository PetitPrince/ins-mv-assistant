import { useStore } from "../../store/Store";
import {
  Talent2,
  TalentStandard,
  TALENTS_PRINCIPAUX_STANDARD2,
  TALENT_SPECIALISATION_TYPE_NAME,
} from "../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import {
  NumberInput,
  Title,
  Text,
  ActionIcon,
  Group,
  Popover,
  TextInput,
  Button,
} from "@mantine/core";
import { Stack } from "@mantine/core";
import { IconBug, IconEdit } from "@tabler/icons";
import { DataTable } from "mantine-datatable";

const EditNameFragment = (props: {
  hidden: boolean;
  recordId: string;
  currentTalent2Principaux: Talent2[];
}) => {
  const setCurrentTalentPrincipal2NameFragment = useStore(
    (state) => state.setCurrentTalentPrincipal2NameFragment
  );
  const addCurrentTalentPrincipal2 = useStore(
    (state) => state.addCurrentTalentPrincipal2
  );
  const updateNameFragmentOrCreateTalentPrincipal = (
    talentId: string,
    nameFragment: string
  ) => {
    const talentExistsInPrimary = props.currentTalent2Principaux.some(
      (t) => t.id === talentId
    );
    console.log(talentExistsInPrimary);
    if (talentExistsInPrimary) {
      setCurrentTalentPrincipal2NameFragment(talentId, nameFragment);
    } else {
      const talentInStandardRepo = TALENTS_PRINCIPAUX_STANDARD2.find(
        (t) => t.id === talentId
      );
      if (talentInStandardRepo) {
        const newTalent: Talent2 = {
          ...talentInStandardRepo,
          customNameFragment: nameFragment,
        };
        addCurrentTalentPrincipal2(newTalent);
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
            // close();
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

export const Talents2Component = (props: {}) => {
  const currentTalents2Principaux = useStore(
    (state) => state.currentPerso.talents2.principaux
  );
  const currentPersoCara = useStore(
    (state) => state.currentPerso.caracteristiques
  );
  const setCurrentTalentPrincipal2PaDepense = useStore(
    (state) => state.setCurrentTalentPrincipal2PaDepense
  );
  const addCurrentTalentPrincipal2 = useStore(
    (state) => state.addCurrentTalentPrincipal2
  );
  const updatePaOrCreateTalentPrincipal = (
    talentId: string,
    updatedPa: number
  ) => {
    const talentExistsInPrimary = currentTalents2Principaux.some(
      (t) => t.id === talentId
    );
    if (talentExistsInPrimary) {
      setCurrentTalentPrincipal2PaDepense(talentId, updatedPa);
    } else {
      const talentInStandardRepo = TALENTS_PRINCIPAUX_STANDARD2.find(
        (t) => t.id === talentId
      );
      if (talentInStandardRepo) {
        const newTalent: Talent2 = {
          ...talentInStandardRepo,
          pa_depense: updatedPa,
        };
        addCurrentTalentPrincipal2(newTalent);
      }
    }
  };

  const talentPrincipauxStandardIds = TALENTS_PRINCIPAUX_STANDARD2.map(
    (x) => x.id
  );
  const rows2: Talent2[] = TALENTS_PRINCIPAUX_STANDARD2;
  let toAdd: Talent2[] = [];
  for (const onetalent of currentTalents2Principaux) {
    if (talentPrincipauxStandardIds.includes(onetalent.id)) {
      const idx = rows2.findIndex((x) => x.id === onetalent.id);
      rows2[idx] = onetalent;
    } else {
      toAdd.push(onetalent);
    }
  }
  const rows = rows2.concat(toAdd);

  return (
    <Stack>
      <Title order={3}>Talents refact</Title>

      <DataTable
        minHeight={150}
        columns={[
          {
            title: "Nom",
            accessor: "name",
            width: 150,
            render: (record: Talent2) => {
              const nameFragment = record.customNameFragment
                ? " (" + record.customNameFragment + ")"
                : "";
              return (
                <Text>
                  {record.name}
                  {nameFragment}
                </Text>
              );
            },
          },
          {
            title: "Niveau",
            accessor: "level",
            width: 80,
            render: (record: Talent2) => {
              const talentLevel = calcTalentLevelFromPaDepense(
                record.pa_depense,
                record,
                currentPersoCara
              );

              return <Text>{talentLevel}</Text>;
            },
          },
          {
            title: "PA Dépensé",
            accessor: "pa_depense",
            width: 100,
            render: (record) => {
              return (
                <NumberInput
                  value={record.pa_depense}
                  onChange={(updatedPa: number) => {
                    updatePaOrCreateTalentPrincipal(record.id, updatedPa);
                  }}
                />
              );
            },
          },
          { title: "Caractéristique associée", accessor: "associatedChara" },
          {
            title: "Actions",
            accessor: "actions",
            render: (record) => {
              const shouldHideEditButton = !(
                record.specialisationType ===
                  TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
                record.id.includes("specifique")
              );
              return (
                <Group spacing={4} position="left" noWrap>
                  <EditNameFragment
                    hidden={shouldHideEditButton}
                    recordId={record.id}
                    currentTalent2Principaux={currentTalents2Principaux}
                  />
                  <ActionIcon color="blue" onClick={() => console.log(record)}>
                    <IconBug size={16} />
                  </ActionIcon>
                </Group>
              );
            },
          },
        ]}
        records={rows}
      />
    </Stack>
  );
};
