import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { CaracteristiquesSet } from "../../utils/const/Personnage";
import {
  Talent,
  TalentCollection,
  TALENT_SPECIALISATION_TYPE_NAME,
  TALENT_TYPE_NAME,
} from "../../utils/const/TalentStandard";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import {
  findTalentInCollection,
  talentExistsInCollection,
} from "../../utils/helper/talentHelpers";
import { CollapsableWithTitle } from "../utils/CollapsableWithTitle";
import { ActionsCell } from "./Tablecell/ActionsCell";
import { CaraCell } from "./Tablecell/CaraCell";
import { LevelCell } from "./Tablecell/LevelCell";
import { NameCell } from "./Tablecell/NameCell";
import { PaDepenseCell } from "./Tablecell/PaDepenseCell";
import { alphaSort } from "./alphaSort";
import { findMatchingStandardTalentInCollection } from "./findMatchingStandardTalentInCollection";
import {
  Title,
  Group,
  TextInput,
  Button,
  Select,
  Table,
  Collapse,
} from "@mantine/core";
import { Stack } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons";
import { useState } from "react";
import slugify from "slugify";

export const TalentsGenerique2 = (props: {
  title: string;
  currentTalentCollection: TalentCollection;
  standardTalentCollection: TalentCollection;
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

  const mergedTalents = {
    ...standardTalentCollection,
    ...currentTalentCollection,
  };
  let rows = Array.from(Object.values(mergedTalents));

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
  //
  const updatePaOrCreateTalent = (talentId: string, updatedPa: number) => {
    if (Object.hasOwn(currentTalentCollection, talentId)) {
      // if (talentExistsInCollection(currentTalentCollection, talentId)) {
      setCurrentTalentPaDepense(talentId, updatedPa);
    } else {
      const talentInStandardRepo = standardTalentCollection[talentId];
      if (talentInStandardRepo) {
        const newTalent: Talent = {
          ...talentInStandardRepo,
          pa_depense: updatedPa,
        };
        addCurrentTalent(newTalent);
      }
    }
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
    <CollapsableWithTitle title="Nouveau talent exotique">
      <form onSubmit={submitNewExoticTalent}>
        <Group align="end">
          <TextInput name="talentName" label="Nom" />
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
          <Button type="submit">Ajouter</Button>
        </Group>
      </form>
    </CollapsableWithTitle>
  );

  const displayRows = rows.map((row: Talent) => {
    let errMsg = "";

    if (row.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE) {
      if (!row.id.includes("_specifique")) {
        const specificTalent = rows
          .filter((x) => x.id.startsWith(row.id))
          .filter((x) => x.id !== row.id)[0];
        if (specificTalent) {
          const baseTalentLevel = calcTalentLevelFromPaDepense(
            row.pa_depense,
            row,
            currentPersoCara
          );
          const specificTalentLevel = calcTalentLevelFromPaDepense(
            specificTalent.pa_depense,
            specificTalent,
            currentPersoCara
          );
          if (baseTalentLevel > specificTalentLevel) {
            errMsg =
              "Le talent spécifique général ne peut pas dépasser la spécialité";
          }
        }
      }
    }

    return (
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
            additionalErrMsg={errMsg}
            updatePaOrCreateTalent={updatePaOrCreateTalent}
          />
        </td>
      </tr>
    );
  });
  const [tableOpened, setTableOpened] = useState(true);
  const iconTableOpened = tableOpened ? (
    <IconChevronDown size={16} />
  ) : (
    <IconChevronRight size={16} />
  );
  return (
    <Stack>
      <Title order={3} onClick={() => setTableOpened((o) => !o)}>
        {" "}
        {iconTableOpened}
        {title}
      </Title>
      <Collapse in={tableOpened}>
        <Table
          sx={{
            "& thead tr th": { width: 100 },
            "& thead tr th:first-child": { width: 50 },
          }}
        >
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
      </Collapse>
    </Stack>
  );
};
