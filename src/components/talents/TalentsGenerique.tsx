import { useStore } from "../../store/Store";
import {
  TalentInvesti,
  TalentInvestiCollection,
} from "../../utils/const/Personnage";
import { TalentStandard } from "../../utils/const/TalentStandard";
import { computeRowsTalents } from "./computeRowsTalents";
import {
  Title,
  Text,
  Group,
  NumberInput,
  ActionIcon,
  Popover,
  TextInput,
  Button,
} from "@mantine/core";
import { Stack } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import slugify from "slugify";

export const TalentsGenerique = (props: {
  talentsStandardCollection: TalentStandard[];
  title: string;
  talentCategory: string;
}) => {
  const talentsStandardCollection = props.talentsStandardCollection;
  const title = props.title;
  const talentCategory = props.talentCategory;
  const characterTalentsPrincipaux = useStore(
    (state) => state.currentPerso.talents.principaux
  );
  const characterTalentsSecondaire = useStore(
    (state) => state.currentPerso.talents.secondaires
  );
  const setCurrentTalentPrincipalPaDepense = useStore(
    (state) => state.setCurrentTalentPrincipalPaDepense
  );
  const setCurrentTalentSecondairePaDepense = useStore(
    (state) => state.setCurrentTalentSecondairePaDepense
  );
  const setCurrentTalentPrincipalNameFragment = useStore(
    (state) => state.setCurrentTalentPrincipalNameFragment
  );
  const setCurrentTalentSecondaireNameFragment = useStore(
    (state) => state.setCurrentTalentSecondaireNameFragment
  );
  const setCurrentTalentSecondaire = useStore(
    (state) => state.setCurrentTalentSecondaire
  );
  const setCurrentTalentPrincipal = useStore(
    (state) => state.setCurrentTalentPrincipal
  );

  let characterTalents: TalentInvestiCollection;
  let setCurrentTalentPaDense: (talentId: string, val: number) => void;
  let setCurrentTalentNameFragment: (talentId: string, val: string) => void;
  let setCurrentTalent: (talentId: string, val: TalentInvesti) => void;
  if (talentCategory === "Principal") {
    characterTalents = characterTalentsPrincipaux;
    setCurrentTalentPaDense = setCurrentTalentPrincipalPaDepense;
    setCurrentTalentNameFragment = setCurrentTalentPrincipalNameFragment;
    setCurrentTalent = setCurrentTalentPrincipal;
  } else {
    characterTalents = characterTalentsSecondaire;
    setCurrentTalentPaDense = setCurrentTalentSecondairePaDepense;
    setCurrentTalentNameFragment = setCurrentTalentSecondaireNameFragment;
    setCurrentTalent = setCurrentTalentSecondaire;
  }
  const currentPerso = useStore((state) => state.currentPerso);

  const setCurrentTalentMultiple = (
    id: string,
    val: number | undefined,
    newCustomNameFragment?: string
  ) => {
    if (val !== undefined) {
      let updatedCustomNameFragment;
      if (
        Object.hasOwn(characterTalents, id) &&
        characterTalents[id].customNameFragment
      ) {
        updatedCustomNameFragment = characterTalents[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      const newTal: TalentInvesti = updatedCustomNameFragment
        ? {
            customNameFragment: updatedCustomNameFragment,
            niveau: 0,
            pa_depense: val,
          }
        : {
            niveau: 0,
            pa_depense: val,
          };
      setCurrentTalent(id, newTal);
    }
  };

  let rows = computeRowsTalents(
    characterTalents,
    currentPerso,
    talentsStandardCollection
  );

  return (
    <Stack>
      <Title order={3}>{title}</Title>

      <DataTable
        columns={[
          {
            title: "Nom",
            accessor: "name",
            render: (record) => {
              if (record.specialisationType === "Spécifique") {
                const primaryTalentId = record.id.split("_specifique")[0];
                const isPrimary = primaryTalentId === record.id;
                if (isPrimary) {
                  return <Text>{record.name}</Text>;
                } else {
                  return (
                    <Group>
                      <Text>{record.name}</Text>

                      <Popover
                        width={300}
                        trapFocus
                        position="bottom"
                        shadow="md"
                      >
                        <Popover.Target>
                          <ActionIcon>
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <form
                            onSubmit={(event: any) => {
                              const talentNameFragment =
                                event.target.talentNameFragment.value;
                              setCurrentTalentNameFragment(
                                record.id,
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
                    </Group>
                  );
                }
              } else if (record.specialisationType === "Multiple") {
                return <Text>{record.name} ↓</Text>;
              } else {
                return <Text>{record.name}</Text>;
              }
            },
          },
          { title: "Niveau", accessor: "level" },
          {
            title: "PA Dépensé",
            accessor: "pa_depense",
            render: (record) => {
              if (record.specialisationType !== "Multiple") {
                return (
                  <Group>
                    <NumberInput
                      value={record.pa_depense}
                      onChange={(val: number) => {
                        setCurrentTalentPaDense(record.id, val);
                      }}
                    />
                  </Group>
                );
              }
            },
          },
          { title: "Carac", accessor: "associatedChara" },
        ]}
        records={rows}
        rowExpansion={{
          // trigger: "always",

          content: ({ record }) => {
            if (record.specialisationType === "Multiple") {
              return (
                <form
                  onSubmit={(event: any) => {
                    let talentNameFragment =
                      event.target.talentNameFragment.value;
                    let newTalentFragmentName =
                      record.id +
                      "_" +
                      slugify(talentNameFragment, { lower: true });
                    setCurrentTalentMultiple(
                      newTalentFragmentName,
                      0,
                      talentNameFragment
                    );
                    event.preventDefault();
                  }}
                >
                  <Group>
                    <Text>Nouveau talent</Text>

                    <TextInput name="talentNameFragment" size="xs" />
                    <Button size="xs" type="submit">
                      Ajouter
                    </Button>
                  </Group>
                </form>
              );
            }
          },
        }}
      />
    </Stack>
  );
};
