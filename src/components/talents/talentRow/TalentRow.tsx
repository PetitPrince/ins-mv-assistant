import { FACTIONS_NAMES } from "../../../utils/const/Factions";
import { CaracteristiquesSet } from "../../../utils/const/Personnage";
import {
  Talent,
  TalentCollection,
  TALENT_SPECIALISATION_TYPE_NAME,
} from "../../../utils/const/TalentStandard";
import { CaraCell } from "./tablecell/CaraCell";
import { LevelCell } from "./tablecell/LevelCell";
import { NameCell } from "./tablecell/NameCell";
import { PaDepenseCell } from "./tablecell/PaDepenseCell";
import { ActionsCellMultiple } from "./tablecell/actioncell/multiple/ActionsCellMultiple";
import { AddNewMutiplePopup } from "./tablecell/actioncell/multiple/AddNewMutiplePopup";

export const TalentRow = (props: {
  row: Talent;
  currentTalentCollection: TalentCollection;
  standardTalentCollection: TalentCollection;
  setCurrentTalentNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  addCurrentTalent: (newTalent: Talent) => void;
  setCurrentTalentPaDepense: (talentId: string, val: number) => void;
  faction: FACTIONS_NAMES;
  currentPersoCara: CaracteristiquesSet;
  errMsg: string;
  updatePaOrCreateTalent: (talentId: string, updatedPa: number) => void;
}) => {
  const {
    row,
    currentTalentCollection,
    standardTalentCollection,
    setCurrentTalentNameFragment,
    addCurrentTalent,
    currentPersoCara,
    faction,
    errMsg,
    updatePaOrCreateTalent,
  } = props;
  let actionCell = null;
  if (
    row.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE &&
    row.id.includes("specifique")
  ) {
    actionCell = (
      <ActionsCellMultiple
        id={row.id}
        currentTalentCollection={currentTalentCollection}
        standardTalentCollection={standardTalentCollection}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment}
        addCurrentTalent={addCurrentTalent}
      />
    );
  } else if (
    row.specialisationType === TALENT_SPECIALISATION_TYPE_NAME.MULTIPLE
  ) {
    actionCell = (
      <AddNewMutiplePopup
        recordId={row.id}
        currentTalentCollection={currentTalentCollection}
        setCurrentTalentNameFragment={setCurrentTalentNameFragment}
        addCurrentTalent={addCurrentTalent}
        standardTalentCollection={standardTalentCollection}
      />
    );
  }
  return (
    <tr key={row.id}>
      <td>{actionCell}</td>
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
};
