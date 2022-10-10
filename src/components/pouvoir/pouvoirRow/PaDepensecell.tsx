import { APPMODE } from "../../../APPMODE";
import { useStore } from "../../../store/Store";
import { FACTIONS_NAMES } from "../../../utils/const/Factions";
import { calcPouvoirLevelFromPaDepense } from "../../../utils/helper/getPouvoirLevel";
import { Group, NumberInput } from "@mantine/core";

export const PaDepensecell = (props: {
  pa_depense: number;
  id: string;
  faction: FACTIONS_NAMES;
  coutEnPa: number;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
}) => {
  const appmode = useStore((state) => state.appMode);
  const computedLevel = calcPouvoirLevelFromPaDepense(
    props.pa_depense,
    props.coutEnPa
  );
  let errorMsgs = [];
  if (computedLevel < 1) {
    errorMsgs.push("Niveau minimum 1");
  }
  if (
    appmode === APPMODE.CREATE &&
    props.faction === FACTIONS_NAMES.ANGES &&
    computedLevel > 2.5
  ) {
    errorMsgs.push("Niveau maximum à la création pour les anges 2.5");
  }
  if (
    appmode === APPMODE.CREATE &&
    props.faction === FACTIONS_NAMES.DEMONS &&
    computedLevel > 2
  ) {
    errorMsgs.push("Niveau maximum à la création pour les démons 2");
  }
  const errorMsg = errorMsgs.join(" + ");

  return (
    <Group>
      <NumberInput
        value={props.pa_depense}
        onChange={(val: number) => {
          props.setCurrentPouvoirPaDepense(props.id, val);
        }}
        error={errorMsg}
      />
    </Group>
  );
};
