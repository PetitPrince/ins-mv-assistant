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
import { CollapsableWithTitle } from "../utils/CollapsableWithTitle";
import { alphaSort } from "./alphaSort";
import { TalentRow } from "./talentRow/TalentRow";
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

export const TalentsGenerique = (props: {
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

  // filtering
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

  // func
  const updatePaOrCreateTalent = (talentId: string, updatedPa: number) => {
    if (Object.hasOwn(currentTalentCollection, talentId)) {
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
    event.preventDefault();
  };
  const exotiqueStuff = (
    <CollapsableWithTitle title="Nouveau talent exotique">
      <form onSubmit={submitNewExoticTalent}>
        <Group align="end">
          <TextInput name="talentName" label="Nom" />
          <Select
            label="Sp??cialisation"
            name="specialisation"
            defaultValue={TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE}
            data={[
              {
                value: TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE,
                label: "G??n??rique",
              },
              {
                value: TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE,
                label: "Sp??cifique",
              },
              {
                value: TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE,
                label: "Multiple",
              },
            ]}
          />
          <Select
            label="Caract??ristique associ??e"
            name="cara_associe"
            defaultValue={CARACTERISTIQUE_NAMES.AUCUNE}
            data={[
              { value: CARACTERISTIQUE_NAMES.AUCUNE, label: "Aucune" },
              { value: CARACTERISTIQUE_NAMES.FORCE, label: "Force" },
              { value: CARACTERISTIQUE_NAMES.AGILITE, label: "Agilit??" },
              { value: CARACTERISTIQUE_NAMES.PERCEPTION, label: "Perception" },
              { value: CARACTERISTIQUE_NAMES.VOLONTE, label: "Volont??" },
              { value: CARACTERISTIQUE_NAMES.PRESENCE, label: "Pr??sence" },
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

    if (
      row.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
      !row.id.includes("_specifique")
    ) {
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
            "Le talent sp??cifique g??n??ral ne peut pas d??passer la sp??cialit??";
        }
      }
    }

    return (
      <TalentRow
        row={row}
        currentTalentCollection={currentTalentCollection}
        standardTalentCollection={standardTalentCollection}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment}
        addCurrentTalent={addCurrentTalent}
        currentPersoCara={currentPersoCara}
        faction={faction}
        errMsg={errMsg}
        updatePaOrCreateTalent={updatePaOrCreateTalent}
        setCurrentTalentPaDepense={setCurrentTalentPaDepense}
      />
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
              <th>Caract??ristique associ??e</th>
              <th>PA depens??</th>
            </tr>
          </thead>
          <tbody>{displayRows}</tbody>
        </Table>
        {title.includes("exotique") ? exotiqueStuff : ""}
      </Collapse>
    </Stack>
  );
};
