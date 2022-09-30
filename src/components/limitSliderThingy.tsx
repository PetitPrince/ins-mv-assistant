import { Group, Slider, Text } from "@mantine/core";

export const LimitSliderThingy = (props: {
  title?: string;
  currentValue: number;
  lowerLimit: number;
  upperLimit: number;
  avgSpent: number;
  max: number;
}) => {
  const { title, currentValue, lowerLimit, upperLimit, avgSpent, max } = props;

  return (
    <Group>
      <Text>{title}</Text>

      <Slider
        value={currentValue}
        // disabled
        label={currentValue}
        size="xs"
        min={0}
        max={max}
        marks={[
          { value: lowerLimit, label: lowerLimit },
          { value: avgSpent, label: avgSpent },
          { value: upperLimit, label: upperLimit },
        ]}
        // sx={{flex-grow: 1}}

        sx={{ minWidth: 200 }}
        styles={(theme) => ({
          track: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.blue[1],
          },
          mark: {
            width: 6,
            height: 6,
            borderRadius: 6,
            transform: "translateX(-3px) translateY(-2px)",
            backgroundColor: theme.black,

            borderColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.blue[1],
          },
          markFilled: {
            borderColor: theme.colors.blue[6],
            backgroundColor: theme.black,
          },
          markLabel: {
            fontSize: theme.fontSizes.xs,
            marginBottom: 5,
            marginTop: 0,
          },
          thumb: {
            height: 16,
            width: 16,
            backgroundColor: theme.white,
            borderWidth: 1,
            boxShadow: theme.shadows.sm,
          },
        })}
      />
    </Group>
  );
};
