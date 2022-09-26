import { INSMVNumberInput } from "../../App";
import { getTalentLevel, useStore } from "../../store/Store";
import { TalentDisplayRow } from "./Talents";
import {
  ActionIcon,
  Button,
  NumberInput,
  Popover,
  TextInput,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { TalentInvestiCollection } from "../../utils/const/Personnage";

export const TalentRowSpecifique = (props: {
  row: TalentDisplayRow;
  talentPool: TalentInvestiCollection;
  setCurrentTalentPaDense: (talentId: string, val: number) => void;
  setCurrentTalentNameFragment: (talentId: string, val: string) => void;
}) => {
  const row = props.row;
  const talentId = row.id;
  const primaryTalentId = talentId.split("-specifique")[0];
  const currentPerso = useStore((state) => state.currentPerso);
  const talentPool = props.talentPool;

  // Check if the primary talent has a higher level than the specialized one
  // Output a warning in the UI if it's the case
  const isPrimaryTalentDefined = Object.hasOwn(talentPool, primaryTalentId); // does the primary talent (talent id without the -specifique suffix) exists in the standard list of talent ?
  let primaryTalentLevel = isPrimaryTalentDefined
    ? getTalentLevel(currentPerso, primaryTalentId)
    : 0;

  const specificTalentLevel = getTalentLevel(currentPerso, talentId);

  let errorString; // keep the if loop in case I want to have anoter error string
  if (primaryTalentLevel > specificTalentLevel) {
    errorString =
      "Le niveau du talent général ne peut pas dépasser la spécialité";
  }

  const setCurrentTalent = (
    id: string,
    val: number | undefined  ) => {
    if (val !== undefined) {
      props.setCurrentTalentPaDense(id, val);
    }
  };

  const setCurrentTalentNameFragment = (talentId: string, val: string) => {
    props.setCurrentTalentNameFragment(talentId, val);
  };

  return (
    <tr key={row.id}>
      <td>
        {row.name}
        <Popover width={300} trapFocus position="bottom" shadow="md">
          <Popover.Target>
            <ActionIcon>
              <IconEdit size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={(event: any) => {
                let talentNameFragment = event.target.talentNameFragment.value;
                setCurrentTalentNameFragment(row.id, talentNameFragment);
                event.preventDefault();
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
      </td>
      <td>
        <INSMVNumberInput
          error={errorString}
          value={specificTalentLevel}
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
