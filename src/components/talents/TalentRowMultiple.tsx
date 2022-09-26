import { INSMVNumberInput } from "../../App";
import { getTalentLevel, useStore } from "../../store/Store";
import { TalentDisplayRow } from "./Talents";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { Group } from "@mantine/core";
import { Text } from "@mantine/core";
import slugify from "slugify";
import { findTalentInCaracterFromName } from "../../utils/helper/findTalentInCaracterFromName";
import { TalentInvesti, TalentInvestiCollection } from "../../utils/const/Personnage";

export const TalentRowMultiple = (props: {
  row: TalentDisplayRow;
  talentPool: TalentInvestiCollection;
  setCurrentTalent: (talentId: string, val: TalentInvesti) => void;
}) => {
  const row = props.row;
  const talentId = row.id;
  const talentPool: TalentInvestiCollection = props.talentPool;
  const currentPerso = useStore((state) => state.currentPerso);

  const setCurrentTalent = (
    id: string,
    val: number | undefined,
    newCustomNameFragment?: string
  ) => {
    if (val !== undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
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
      props.setCurrentTalent(id, newTal);
    }
  };
  if (row.level === undefined) {
    return (
      <tr key={row.id}>
        <td>{row.name}</td>
        <td>
          <Text>Nom du talent</Text>
          <Group mt="xs" spacing="xs">
            <form
              onSubmit={(event: any) => {
                let talentNameFragment = event.target.talentNameFragment.value;
                let newTalentFragmentName =
                  row.id + "_" + slugify(talentNameFragment, { lower: true });
                setCurrentTalent(newTalentFragmentName, 0, talentNameFragment);
                event.preventDefault();
              }}
            >
              <TextInput name="talentNameFragment" size="xs" />
              <Button size="xs" type="submit">
                Ajouter
              </Button>
            </form>
          </Group>
        </td>
        <td>{row.associatedChara}</td>
      </tr>
    );
  }
  // Get the fragment name from the displayed name
  const t = findTalentInCaracterFromName(currentPerso, row.id);
  const parensContent = t?.customNameFragment;
  // const justTheParens = row.name.match(/\([^\)]*\)/);
  // const parensContent = justTheParens ? justTheParens[0].slice(1, justTheParens[0].length - 1) : undefined;
  const niveau = getTalentLevel(currentPerso, talentId);

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
            setCurrentTalent(row.id, val, parensContent);
          }}
        />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
};
