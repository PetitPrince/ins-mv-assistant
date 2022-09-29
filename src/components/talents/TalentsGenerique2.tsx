import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { CaracteristiquesSet } from "../../utils/const/Personnage";
import {
  Talent,
  TALENT_SPECIALISATION_TYPE_NAME,
  TALENT_TYPE_NAME,
} from "../../utils/const/TalentStandard";
import {
  findTalentInCollection,
  talentExistsInCollection,
} from "../../utils/helper/talentHelpers";
import { ActionsCell } from "./Tablecell/ActionsCell";
import { CaraCell } from "./Tablecell/CaraCell";
import { LevelCell } from "./Tablecell/LevelCell";
import { NameCell } from "./Tablecell/NameCell";
import { PaDepenseCell } from "./Tablecell/PaDepenseCell";
import { alphaSort } from "./alphaSort";
import { findMatchingStandardTalentInCollection } from "./findMatchingStandardTalentInCollection";
import { Title, Group, TextInput, Button, Select, Table } from "@mantine/core";
import { Stack } from "@mantine/core";
import slugify from "slugify";

export const TalentsGenerique2 = (props: {
  title: string;
  currentTalentCollection: Talent[];
  standardTalentCollection: Talent[];
  currentPersoCara: CaracteristiquesSet;
  currentPersoSuperieur: string;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
  setCurrentTalentPaDepense: (talentId: string, val: number) => void;
  faction: FACTIONS_NAMES;
}) => {
  const {
    title,
    currentTalentCollection,
    setCurrentTalentPaDepense,
    addCurrentTalent,
    setCurrentTalentNameFragment,
    standardTalentCollection,
    currentPersoCara,
    currentPersoSuperieur,
    faction,
  } = props;

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

  const displayRows = rows.map((row: Talent) => (
    <tr key={row.id}>
      <td>
        <ActionsCell
          specialisationType={row.specialisationType}
          id={row.id}
          currentTalentCollection={currentTalentCollection}
          standardTalentCollection={standardTalentCollection}
          setCurrentTalentNameFragment={setCurrentTalentNameFragment}
          setCurrentTalentPaDepense={setCurrentTalentPaDepense}
          addCurrentTalent={addCurrentTalent}
        />
      </td>
      <td>
        <NameCell
          name={row.name}
          id={row.id}
          customNameFragment={row.customNameFragment}
        />
      </td>
      <td>
        <LevelCell
          pa_depense={row.pa_depense}
          talent={row}
          cara={currentPersoCara}
        />
      </td>
      <td>
        <CaraCell cara={row.associatedChara} />
      </td>
      <td>
        <PaDepenseCell
          pa_depense={row.pa_depense}
          talent={row}
          cara={currentPersoCara}
          faction={faction}
          id={row.id}
          updatePaOrCreateTalent={updatePaOrCreateTalent}
        />
      </td>
    </tr>
  ));

  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Caractéristique associée</th>
            <th>PA depensé</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>
      {title.includes("exotique") ? exotiqueStuff : ""}
    </Stack>
  );
};
