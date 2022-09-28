import {
  TalentStandard,
  TALENTS_EXOTIQUES_STANDARD,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_SECONDAIRES_STANDARD,
} from "../../utils/const/TalentStandard";
import { TalentsGenerique } from "./TalentsGenerique";
import { Grid, Title } from "@mantine/core";
import { Stack } from "@mantine/core";

export interface TalentDisplayRow extends TalentStandard {
  level: number | undefined;
  pa_depense: number;
}

export const Talents = (props: {}) => {
  return (
    <Stack>
      <Title order={2}>Talents</Title>
      <Grid>
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents principaux"
            talentsStandardCollection={TALENTS_PRINCIPAUX_STANDARD}
            talentCategory="Principal"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents exotique"
            talentsStandardCollection={TALENTS_EXOTIQUES_STANDARD}
            talentCategory="Exotique"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents secondaires"
            talentsStandardCollection={TALENTS_SECONDAIRES_STANDARD}
            talentCategory="Secondaire"
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
