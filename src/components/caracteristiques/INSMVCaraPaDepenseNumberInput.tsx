import { NumberInput, NumberInputProps } from "@mantine/core";

interface INSMVCaraNumberInputProps extends NumberInputProps {
  isModified: boolean;
  errorMsg: string;
}
export const INSMVCaraPaDepenseNumberInput = (
  props: INSMVCaraNumberInputProps
) => {
  const { isModified, errorMsg, ...restOfTheProps } = props; // extracting  initialValue from props (I want to pass props forward to NumberInput)
  const variant = isModified ? "filled" : "default";
  // const errorString = isModified && availablePa < 0 ? "  " : "";

  return (
    <NumberInput
      // {...props}
      {...restOfTheProps}
      variant={variant}
      // radius={radius}
      step={2}
      error={errorMsg}
    />
  );
};
