import { CARACTERISTIQUE_NAMES } from "../../utils/const/Caracteristiques_names";
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
}) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Center>
          <Text size="xs">{props.caracName}</Text>
        </Center>
        <Center>
          <Title>{props.caracNiveau}</Title>
        </Center>
      </Card.Section>
      <INSMVCaraPaDepenseNumberInput
        size="sm"
        styles={{ input: { width: 75, textAlign: "center" } }}
        initialValue={props.og_pa_depense}
        availablePa={props.availablePa}
        label="PA dépensé"
        value={props.cara_pa_depense}
        onChange={(val: number) => props.setPaDepense(val, props.caraNameEnum)}
      />
    </Card>
  );
};
