import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Blessures } from "../status/Blessures";
import { Stack, Title, Group, Slider, Container } from "@mantine/core";
import { useState } from "react";

export const PlayStatus = (props: {
  ppMax: number;
  pfMax: number;
  force: number;
  faction: FACTIONS_NAMES;
}) => {
  const [ppSliderValue, setPPSliderValue] = useState(props.ppMax);
  const [pfSliderValue, setPfSliderValue] = useState(props.pfMax);

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <Stack>
          <Title order={4}>PP</Title>
          <Container sx={{ minWidth: 300 }}>
            <Slider
              min={0}
              max={props.ppMax}
              value={ppSliderValue}
              thumbSize={20}
              size="xl"
              onChange={setPPSliderValue}
              labelAlwaysOn
            />
          </Container>
          <Title order={4}>PF</Title>
          <Container sx={{ minWidth: 300 }}>
            <Slider
              min={-5}
              max={props.pfMax}
              value={pfSliderValue}
              thumbSize={20}
              size="xl"
              marks={[{ value: 0, label: 0 }]}
              onChange={setPfSliderValue}
              labelAlwaysOn
            />
          </Container>
        </Stack>
        <Blessures force={props.force} faction={props.faction} showMarkers />
      </Group>
    </Stack>
  );
};
