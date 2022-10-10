import { FACTIONS_NAMES } from "../../../utils/const/Factions";
import { Pouvoir } from "../../../utils/const/Pouvoir";
import { PaDepensecell } from "./PaDepensecell";
import { PouvoirLevelCell } from "./PouvoirLevelCell";
import { ActionIcon } from "@mantine/core";
import { IconTrashX } from "@tabler/icons";

export const PouvoirRow = (props: {
  row: Pouvoir;
  deleteCurrentPouvoir: (pouvoirId: string) => void;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
  faction: FACTIONS_NAMES;
}) => {
  const { row, faction, setCurrentPouvoirPaDepense, deleteCurrentPouvoir } =
    props;

  return (
    <tr key={row.id}>
      <td>
        <ActionIcon onClick={() => deleteCurrentPouvoir(row.id)}>
          <IconTrashX size={16} />
        </ActionIcon>
      </td>
      <td>{row.nom}</td>
      <td>
        <PouvoirLevelCell pa_depense={row.pa_depense} coutEnPa={row.coutEnPa} />
      </td>
      <td>{row.coutEnPP}</td>
      <td>{row.coutEnPa}</td>
      <td>
        <PaDepensecell
          pa_depense={row.pa_depense}
          id={row.id}
          setCurrentPouvoirPaDepense={setCurrentPouvoirPaDepense}
          faction={faction}
          coutEnPa={row.coutEnPa}
        />
      </td>
    </tr>
  );
};
