import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import { INSMVCaraPaDepenseNumberInput } from "./INSMVCaraPaDepenseNumberInput";
import { Title, Text, Card, Center } from "@mantine/core";

export const CaracteristiqueCard = (props: {
  caracName: string;
  caracNiveau: number;
  og_pa_depense: number;
  cara_pa_depense: number;
  availablePa: number;
  setPaDepense: (val: number, cara: CARACTERISTIQUE_NAMES) => void;
  caraNameEnum: CARACTERISTIQUE_NAMES;
  currentGrade: number;
}) => {
  const {
    caracName,
    caracNiveau,
    og_pa_depense,
    cara_pa_depense,
    availablePa,
    setPaDepense,
    caraNameEnum,
    currentGrade,
  } = props;

  const isModified = cara_pa_depense !== og_pa_depense;
  let errorMsg = "";
  if (currentGrade === 0 && caracNiveau > 5.5) {
    errorMsg = "Un grade 0 ne peut pas dépasser 5+";
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Center>
          <Text size="xs">{caracName}</Text>
        </Center>
        <Center>
          <Title>{caracNiveau}</Title>
        </Center>
      </Card.Section>
      <INSMVCaraPaDepenseNumberInput
        size="sm"
        styles={{ input: { width: 75, textAlign: "center" } }}
        isModified={isModified}
        label="PA dépensé"
        value={cara_pa_depense}
        onChange={(val: number) => setPaDepense(val, caraNameEnum)}
        errorMsg={errorMsg}
      />
    </Card>
  );
};
