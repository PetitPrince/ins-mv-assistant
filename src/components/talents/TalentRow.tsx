import { INSMVNumberInput } from "../../App";
import { getTalentLevel, useStore } from "../../store/Store";
import { TalentDisplayRow } from "./Talents";
import { NumberInput } from "@mantine/core";

export const TalentRow = (props: {
  row: TalentDisplayRow;
  setCurrentTalentPaDense: (talentId: string, val: number) => void;
}) => {
  const row = props.row;
  const perso = useStore((state) => state.currentPerso);

  const niveau = getTalentLevel(perso, row.id);

  const setCurrentTalent = (
    id: string,
    val: number | undefined,
  ) => {
    if (val !== undefined) {
      props.setCurrentTalentPaDense(id, val);
    }
  };

  return (
    <tr key={row.id}>
      <td>{row.name}</td>
      <td>
        <INSMVNumberInput
          value={niveau}
          hideControls
          readOnly
          variant="unstyled"
        />
        <NumberInput
          value={row.pa_depense}
          onChange={(val: number) => {
            setCurrentTalent(row.id, val);
          }}
        />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
};