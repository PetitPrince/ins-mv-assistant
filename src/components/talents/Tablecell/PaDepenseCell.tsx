import { NumberInput } from "@mantine/core";

export const PaDepenseCell = (props: {
  pa_depense: number;
  id: string;
  updatePaOrCreateTalent: (id: string, updatedPa: number) => void;
}) => {
  const { pa_depense, id, updatePaOrCreateTalent } = props;
  return (
    <NumberInput
      value={pa_depense}
      onChange={(updatedPa: number) => {
        updatePaOrCreateTalent(id, updatedPa);
      }}
    />
  );
};
