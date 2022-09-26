import { NumberInput, NumberInputProps } from "@mantine/core";

interface INSMVCaraNumberInputProps extends NumberInputProps {
  initialValue: number;
  availablePa: number;
}
export const INSMVCaraPaDepenseNumberInput = (
  props: INSMVCaraNumberInputProps
) => {
  const { initialValue, availablePa, ...restOfTheProps } = props; // extracting  initialValue from props (I want to pass props forward to NumberInput)
  const isModified = props.value !== initialValue;
  const variant = isModified ? "filled" : "default";
  const errorString = isModified && availablePa < 0 ? "  " : "";

  return (
    <NumberInput
      // {...props}
      {...restOfTheProps}
      variant={variant}
      // radius={radius}
      error={errorString}
    />
  );
};
