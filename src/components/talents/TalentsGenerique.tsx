import { useStore } from "../../store/Store";
import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import {
  TalentInvesti,
  TalentInvestiCollection,
} from "../../utils/const/Personnage";
import { TalentStandard } from "../../utils/const/TalentStandard";
import { getTalentLevel } from "../../utils/helper/getTalentLevel";
import { TalentDisplayRow } from "./Talents";
import { computeRowsTalentsFromStandardTalents } from "./computeRowsTalents";
import {
  Title,
  Text,
  Group,
  NumberInput,
  ActionIcon,
  Popover,
  TextInput,
  Button,
  Select,
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
  const characterTalentsExotiques = useStore(
    (state) => state.currentPerso.talents.exotiques
  );

  const setCurrentTalentPrincipalPaDepense = useStore(
    (state) => state.setCurrentTalentPrincipalPaDepense
  );
  const setCurrentTalentSecondairePaDepense = useStore(
    (state) => state.setCurrentTalentSecondairePaDepense
  );
  const setCurrentTalentExotiquePaDepense = useStore(
    (state) => state.setCurrentTalentExotiquePaDepense
  );
  const setCurrentTalentExotique = useStore(
    (state) => state.setCurrentTalentExotique
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
  } else if (talentCategory === "Secondaire") {
    characterTalents = characterTalentsSecondaire;
    setCurrentTalentPaDense = setCurrentTalentSecondairePaDepense;
    setCurrentTalentNameFragment = setCurrentTalentSecondaireNameFragment;
    setCurrentTalent = setCurrentTalentSecondaire;
  } else {
    let charaExo: TalentInvestiCollection = {};
    Object.entries(characterTalentsExotiques).forEach(([k, v]) => {
      const lvl = v.level || 0;
      charaExo[k] = {
        pa_depense: v.pa_depense,
        niveau: lvl,
      };
    });
    characterTalents = charaExo;
    setCurrentTalentPaDense = setCurrentTalentExotiquePaDepense;
    // setCurrentTalentNameFragment = setCurrentTalentExotiqueNameFragment;
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

  let rows = computeRowsTalentsFromStandardTalents(
    characterTalents,
    currentPerso,
    talentsStandardCollection
  );
  if (props.talentCategory === "Exotique") {
    // Add the exotique talent... but not the one  that's standard
    const currentTalentsExotiques = currentPerso.talents.exotiques;
    const standardExoticTalentsIds = talentsStandardCollection.map((x) => x.id);
    const filteredCurrentTalentsExotiques = Object.values(
      currentTalentsExotiques
    ).filter((x) => {
      return !standardExoticTalentsIds.includes(x.id);
    });
    // const someFilteredEntries = Object.entries(currentTalentsExotiques).filter(
    //   ([k, v]) => {
    //     return !standardExoticTalentsIds.includes(k);
    //   }
    // );

    if (currentPerso.superieur) {
      rows = rows.filter((x) =>
        x.superieur_exotique.includes(currentPerso.superieur)
      );
    } else {
      rows = rows.filter((x) => !x.superieur_exotique);
    }

    filteredCurrentTalentsExotiques.forEach((x) => {
      rows.push({
        level: x.level,
        id: x.id,
        name: x.name,
        pa_depense: x.pa_depense,
        associatedChara: x.associatedChara,
        specialisationType: x.specialisationType,
        isInnate: x.isInnate,
        talentType: x.talentType,
        superieur_exotique: x.superieur_exotique,
      });
    });

    //currentPerso.talents.exotiques
    rows.push({
      level: 0,
      id: "new-exotic",
      name: "nouveau",
      pa_depense: 0,
      associatedChara: "Aucune",
      specialisationType: "Générique",
      isInnate: false,
      talentType: "Exotique",
      superieur_exotique: "string",
    });
  }

  const renderNameColumn = (record: TalentDisplayRow) => {
    if (record.specialisationType === "Spécifique") {
      const primaryTalentId = record.id.split("_specifique")[0];
      const isPrimary = primaryTalentId === record.id;
      if (isPrimary) {
        return <Text>{record.name}</Text>;
      } else {
        return (
          <Group>
            <Text>{record.name}</Text>

            <Popover width={300} trapFocus position="bottom" shadow="md">
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
                    setCurrentTalentNameFragment(record.id, talentNameFragment);
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
  };
  const renderLevelColumn = (record: TalentDisplayRow) => {
    const computedLevel = getTalentLevel(currentPerso, record.id);
    return <Text>{computedLevel}</Text>;
  };
  const renderPaDepenseColumn = (record: TalentDisplayRow) => {
    if (record.specialisationType === "Multiple") {
    } else if (record.id === "new-exotic") {
      <Group>
        <NumberInput value={record.pa_depense} disabled />
      </Group>;
    } else {
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
  };
  return (
    <Stack>
      <Title order={3}>{title}</Title>

      <DataTable
        minHeight={150}
        columns={[
          {
            title: "Nom",
            accessor: "name",
            render: renderNameColumn,
          },
          {
            title: "Niveau",
            accessor: "level",
            render: renderLevelColumn,
          },
          {
            title: "PA Dépensé",
            accessor: "pa_depense",
            render: renderPaDepenseColumn,
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
            } else if (record.id === "new-exotic") {
              return (
                <form
                  onSubmit={(event: any) => {
                    const newTalentName = event.target.talentNameFragment.value;
                    let newTalentId = slugify(newTalentName, { lower: true });
                    const newTalentCaraAssocie =
                      event.target.cara_associe.value;
                    const newTalent = {
                      specialisationType: "Générique",
                      name: newTalentName,
                      id: newTalentId,
                      associatedChara: newTalentCaraAssocie,
                      isInnate: false,
                      superieur_exotique: "",
                      talentType: "Exotique",
                      level: 0,
                      pa_depense: 0,
                    };

                    setCurrentTalentExotique(newTalentId, newTalent);
                    event.preventDefault();
                  }}
                >
                  <Group>
                    <Text>Nouveau talent</Text>

                    <TextInput name="talentNameFragment" size="xs" />

                    <Select
                      label="Caracteristique associé"
                      data={[
                        { value: CARACTERISTIQUE_NAMES.FORCE, label: "Force" },
                        {
                          value: CARACTERISTIQUE_NAMES.AGILITE,
                          label: "Agilité",
                        },
                        {
                          value: CARACTERISTIQUE_NAMES.PERCEPTION,
                          label: "Perception",
                        },
                        {
                          value: CARACTERISTIQUE_NAMES.PRESENCE,
                          label: "Présence",
                        },
                        {
                          value: CARACTERISTIQUE_NAMES.VOLONTE,
                          label: "Volonté",
                        },
                        { value: CARACTERISTIQUE_NAMES.FOI, label: "Foi" },
                      ]}
                      name="cara_associe"
                    />

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
