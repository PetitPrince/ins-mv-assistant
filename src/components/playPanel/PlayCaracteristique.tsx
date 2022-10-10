import { CaracteristiquesSet } from "../../utils/const/Personnage";
import { calcCaracteristiqueLevelFromPaDepense } from "../../utils/helper/getCaracteristiqueLevel";
import {
  Title,
  Group,
  Text,
  Card,
  Center,
  Divider,
  Stack,
} from "@mantine/core";

export const PlayCaracteristique = (props: { carac: CaracteristiquesSet }) => {
  const forceLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.force.pa_depense
  );
  const agiliteLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.agilite.pa_depense
  );
  const perceptionLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.perception.pa_depense
  );
  const volonteLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.volonte.pa_depense
  );
  const presenceLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.presence.pa_depense
  );
  const foiLvl = calcCaracteristiqueLevelFromPaDepense(
    props.carac.foi.pa_depense
  );
  return (
    <Stack>
      <Title order={2}>Caractéristiques</Title>
      <Group spacing="xs">
        <PlayCaracteristiqueCard caracName="Force" caracNiveau={forceLvl} />
        <PlayCaracteristiqueCard caracName="Agilité" caracNiveau={agiliteLvl} />
        <PlayCaracteristiqueCard
          caracName="Perception"
          caracNiveau={perceptionLvl}
        />
        <PlayCaracteristiqueCard caracName="Volonté" caracNiveau={volonteLvl} />
        <PlayCaracteristiqueCard
          caracName="Présence"
          caracNiveau={presenceLvl}
        />
        <PlayCaracteristiqueCard caracName="Foi" caracNiveau={foiLvl} />
      </Group>
    </Stack>
  );
};
const PlayCaracteristiqueCard = (props: {
  caracName: string;
  caracNiveau: number;
}) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder sx={{ minWidth: 100 }}>
      <Center>
        <Text size="sm">{props.caracName}</Text>
      </Center>
      <Divider my="sm" />
      <Center>
        <Title>{props.caracNiveau}</Title>
      </Center>
    </Card>
  );
};
