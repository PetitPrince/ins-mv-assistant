import {
  TalentStandard,
  TALENTS_PRINCIPAUX_STANDARD,
  TALENTS_SECONDAIRES_STANDARD
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
            standardTalentPool={TALENTS_PRINCIPAUX_STANDARD}
            tpool="Principal"
          />
        </Grid.Col>
        {/* <Grid.Col span={4}>
              <TalentsExotiques talentsExotiquesDuPerso={props.talentsExotiquesDuPerso} />
            </Grid.Col>*/}
        <Grid.Col span={4}>
          <TalentsGenerique
            title="Talents secondaires"
            standardTalentPool={TALENTS_SECONDAIRES_STANDARD}
            tpool="Secondaire"
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
