import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { CaracteristiquesSet } from "../../utils/const/Personnage";
import { Pouvoir } from "../../utils/const/Pouvoir";
import {
  Talent,
  TalentCollection,
  TALENTS_EXOTIQUES_STANDARD,
  TALENTS_EXOTIQUES_STANDARD_OBJ,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_PRINCIPAUX_STANDARD_OBJ,
  TALENTS_SECONDAIRES_STANDARD,
  TALENTS_SECONDAIRES_STANDARD_OBJ,
} from "../../utils/const/TalentStandard";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import { EquipementEtRessources } from "../equipementEtRessources/EquipementEtRessources";
import { PouvoirLevelCell } from "../pouvoir/PouvoirLevelCell";
import { calcPPFromPaDepense } from "../status/Status";
import { CaraCell } from "../talents/Tablecell/CaraCell";
import { LevelCell } from "../talents/Tablecell/LevelCell";
import { NameCell } from "../talents/Tablecell/NameCell";
import { alphaSort } from "../talents/alphaSort";
import { findMatchingStandardTalentInCollection } from "../talents/findMatchingStandardTalentInCollection";
import { PlayCaracteristique } from "./PlayCaracteristique";
import { PlayStatus } from "./PlayStatus";
import {
  Stack,
  Title,
  Group,
  Text,
  Space,
  NumberInput,
  Dialog,
  Table,
  Textarea,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import { useState } from "react";

export const PlayPanel = (props: {}) => {
  const perso = useStore((state) => state.currentPerso);
  let displayFaction;
  switch (perso.faction) {
    case FACTIONS_NAMES.ANGES:
      displayFaction = "Ange";
      break;
    case FACTIONS_NAMES.DEMONS:
      displayFaction = "Démon";
      break;
    case FACTIONS_NAMES.TROISIEME_FORCE:
      displayFaction = "Héros";
      break;
    default:
      displayFaction = "Bidule";
      break;
  }
  const force = calcCaracteristiqueLevelFromPaDepense(
    perso.caracteristiques.force.pa_depense
  );
  const foi = calcCaracteristiqueLevelFromPaDepense(
    perso.caracteristiques.foi.pa_depense
  );
  const volonte = calcCaracteristiqueLevelFromPaDepense(
    perso.caracteristiques.volonte.pa_depense
  );
  const ppMax = calcPPFromPaDepense(volonte, foi, perso.pp_pa_depense);
  const pfMax = force + volonte;
  const currentPersoSuperieur = perso.superieur;

  return (
    <>
      <Stack>
        <Group sx={{ "align-items": "flex-end" }}>
          <Title order={1}>
            {perso.identite ? perso.identite : "Personnage sans nom"}
          </Title>
          <Text>
            {displayFaction} de {perso.superieur} de grade {perso.grade}
          </Text>
        </Group>
        <Group sx={{ alignItems: "flex-start" }}>
          <PlayStatus
            ppMax={ppMax}
            pfMax={pfMax}
            force={force}
            faction={perso.faction}
          />
          <PlayCaracteristique carac={perso.caracteristiques} />
        </Group>
        <Group sx={{ "align-items": "flex-start" }}>
          <PlayTalentGenerique
            title={"Talents principaux"}
            standardTalentCollection={TALENTS_PRINCIPAUX_STANDARD_OBJ}
            currentTalentCollection={perso.talents.principaux}
            currentPersoCara={perso.caracteristiques}
            currentPersoSuperieur={perso.superieur}
          />
          <Stack>
            <PlayTalentGenerique
              title={"Talents secondaires"}
              standardTalentCollection={TALENTS_SECONDAIRES_STANDARD_OBJ}
              currentTalentCollection={perso.talents.secondaires}
              currentPersoCara={perso.caracteristiques}
              currentPersoSuperieur={perso.superieur}
            />
            <PlayTalentGenerique
              title={"Talents exotique"}
              standardTalentCollection={TALENTS_EXOTIQUES_STANDARD_OBJ}
              currentTalentCollection={perso.talents.exotiques}
              currentPersoCara={perso.caracteristiques}
              currentPersoSuperieur={perso.superieur}
            />
          </Stack>
          <PlayPouvoir currentPouvoirs={Object.values(perso.pouvoirs)} />
        </Group>
        <PlayEquipment />
        <Notes />
      </Stack>
    </>
  );
};
const Notes = (props: {}) => {
  const notes = useStore((state) => state.currentPerso.notes);
  const [value, onChange] = useState(notes);
  const setCurrentNotes = useStore((state) => state.setCurrentNotes);
  const onBlur = (something: any) => {
    setCurrentNotes(value);
  };
  return (
    <Stack>
      <Title order={3}>Notes</Title>
      <RichTextEditor
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        id="rte"
        controls={[
          ["bold", "italic", "underline", "link", "image"],
          ["unorderedList", "orderedList", "h1", "h2", "h3"],
          ["sup", "sub"],
          ["alignLeft", "alignCenter", "alignRight"],
        ]}
      />
    </Stack>
  );
};
const PlayPouvoir = (props: { currentPouvoirs: Pouvoir[] }) => {
  const displayRows = Object.values(props.currentPouvoirs).map(
    (row: Pouvoir) => {
      return (
        <tr key={row.id}>
          <td>{row.nom}</td>
          <td>
            <PouvoirLevelCell
              pa_depense={row.pa_depense}
              coutEnPa={row.coutEnPa}
            />
          </td>
          <td>{row.coutEnPP}</td>
        </tr>
      );
    }
  );

  return (
    <Stack>
      <Title order={3}>Pouvoir</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Coût en PP</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>
    </Stack>
  );
};

const PlayTalentGenerique = (props: {
  title: string;
  standardTalentCollection: TalentCollection;
  currentTalentCollection: TalentCollection;
  currentPersoCara: CaracteristiquesSet;
  currentPersoSuperieur: string;
}) => {
  const {
    title,
    standardTalentCollection,
    currentTalentCollection,
    currentPersoCara,
    currentPersoSuperieur,
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
  rows = rows.filter(
    (x) => calcTalentLevelFromPaDepense(x.pa_depense, x, currentPersoCara) > 0
  );
  const displayRows = rows.map((row: Talent) => {
    return (
      <tr key={row.id}>
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
      </tr>
    );
  });

  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Caractéristique associée</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>
    </Stack>
  );
};

const PlayEquipment = (props: {}) => {
  return (
    <>
      <EquipementEtRessources />
    </>
  );
};
