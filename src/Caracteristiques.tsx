import { NumberInputProps } from '@mantine/core';
import { Stack, Group, Title } from '@mantine/core';
import { INSMVNumberInput, TCaracteristiquesSet, CARACTERISTIQUES, ICaracteristiquesSet, ICaracteristiquesSet2 } from './App';
import { useStore } from "./Store";

interface INSMVCaraNumberInputProps extends NumberInputProps {
  initialValue: number;
  availablePa: number;
}
const INSMVCaraNumberInput = (props: INSMVCaraNumberInputProps) => {
  const { initialValue, availablePa, ...restOfTheProps } = props; // extracting  initialValue from props (I want to pass props forward to NumberInput)
  console.log("props.value: "+props.value+"; initialValue: "+initialValue);
  const isModified = props.value !== initialValue;
  const variant = isModified ? "filled" : "default";
  // const radius = isModified ? "xl" : "sm";
  const errorString = isModified && availablePa < 0 ? "  " : "";

  return (
    <INSMVNumberInput
      // {...props}
      min={1.5} max={9.5}
      {...restOfTheProps}
      variant={variant}
      // radius={radius}
       error={errorString} />
  );
};


export function Caracteristiques(props: { caracteristiques: ICaracteristiquesSet2; initialCaracteristiques: ICaracteristiquesSet2; availablePa: number; }) {
  // const {force, agilite,perception, volonte, presence, foi } = useStore(state => state.currentPerso.caracteristiques)
  const { force, agilite, perception, volonte, presence, foi } = props.caracteristiques;
  const { force: og_force, agilite: og_agilite, perception: og_perception, volonte: og_volonte, presence: og_presence, foi: og_foi } = props.initialCaracteristiques;
  const availablePa = props.availablePa;
  const storeCaracteristiques = useStore(state => state.setCurrentCaracteristiques);
  const setCaracteristiques = (val: number, cara: CARACTERISTIQUES) => {
    storeCaracteristiques(val, cara);
  };


  return (
    <Stack>
      <Title order={2}>Caractéristiques</Title>
      <Group>
        <INSMVCaraNumberInput label="Force" value={force.niveau} initialValue={og_force.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.FORCE)} />
        <INSMVCaraNumberInput label="Agilité" value={agilite.niveau} initialValue={og_agilite.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.AGILITE)} />
        <INSMVCaraNumberInput label="Perception" value={perception.niveau} initialValue={og_perception.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.PERCEPTION)} />
        <INSMVCaraNumberInput label="Volonté" value={volonte.niveau} initialValue={og_volonte.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.VOLONTE)} />
        <INSMVCaraNumberInput label="Présence" value={presence.niveau} initialValue={og_presence.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.PRESENCE)} />
        <INSMVCaraNumberInput label="Foi" value={foi.niveau} initialValue={og_foi.niveau} availablePa={availablePa} onChange={(val: number) => setCaracteristiques(val, CARACTERISTIQUES.FOI)} />
      </Group>
    </Stack>

  );
}
