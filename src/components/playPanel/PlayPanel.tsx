import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { CaracteristiquesSet } from "../../utils/const/Personnage";
import {
  Talent,
  TALENTS_EXOTIQUES_STANDARD,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_SECONDAIRES_STANDARD,
} from "../../utils/const/TalentStandard";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
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
} from "@mantine/core";

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
        {/* <Button onClick={printFeed}>Print feedback</Button> */}
        <Group sx={{ "align-items": "flex-end" }}>
          {/* <Group > */}
          <Title order={1}>{perso.identite}</Title>
          <Text>
            {displayFaction} de {perso.superieur} de grade {perso.grade}
          </Text>
        </Group>
        <PlayStatus
          ppMax={ppMax}
          pfMax={pfMax}
          force={force}
          faction={perso.faction}
        />

        <PlayCaracteristique carac={perso.caracteristiques} />

        <PlayEquipment />
        <Group sx={{ "align-items": "flex-start" }}>
          <PlayTalentGenerique
            title={"Talents principaux"}
            standardTalentCollection={TALENTS_PRINCIPAUX_STANDARD}
            currentTalentCollection={perso.talents.principaux}
            currentPersoCara={perso.caracteristiques}
            currentPersoSuperieur={perso.superieur}
          />
          <PlayTalentGenerique
            title={"Talents secondaires"}
            standardTalentCollection={TALENTS_SECONDAIRES_STANDARD}
            currentTalentCollection={perso.talents.secondaires}
            currentPersoCara={perso.caracteristiques}
            currentPersoSuperieur={perso.superieur}
          />
          <PlayTalentGenerique
            title={"Talents exotique"}
            standardTalentCollection={TALENTS_EXOTIQUES_STANDARD}
            currentTalentCollection={perso.talents.exotiques}
            currentPersoCara={perso.caracteristiques}
            currentPersoSuperieur={perso.superieur}
          />
        </Group>
      </Stack>
    </>
  );
};

const PlayTalentGenerique = (props: {
  title: string;
  standardTalentCollection: Talent[];
  currentTalentCollection: Talent[];
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
      <Title order={2}>Équipement</Title>
      <Group>
        <NumberInput label="Précision" />
        <NumberInput label="Puissance" />
        <NumberInput label="Protection" />
      </Group>
    </>
  );
};
