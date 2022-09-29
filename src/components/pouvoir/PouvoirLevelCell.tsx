import { calcPouvoirLevelFromPaDepense } from "../../utils/helper/getPouvoirLevel";
import { Text } from "@mantine/core";

export const PouvoirLevelCell = (props: {
  pa_depense: number;
  coutEnPa: number;
}) => {
  const computedLevel = calcPouvoirLevelFromPaDepense(
    props.pa_depense,
    props.coutEnPa
  );
  return <Text>{computedLevel}</Text>;
};
