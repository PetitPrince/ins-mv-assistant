import './App.css';
import { MantineProvider, NumberInputProps } from '@mantine/core';
import { Button, TextInput, NumberInput, Autocomplete, Stack, Group, Select, Title, Table } from '@mantine/core';
import { Radio, Grid, ActionIcon, Dialog, Text } from '@mantine/core';
import { talents_par_defaut } from './talents';
import { IconPlus, IconMinus, IconRotate, IconCheck, IconX } from '@tabler/icons'
import React, { Component, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useInputState } from '@mantine/hooks';
import { useState } from 'react';
import { useSetState } from '@mantine/hooks';
import { render } from '@testing-library/react';
import { FACTIONS, Factions } from './myConst';
import { ppid } from 'process';

const INSMVNumberInput = (props: NumberInputProps) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

interface INSMVCaraNumberInputProps extends NumberInputProps {
  initialValue: number,
  paAfterBilling: number
}
const INSMVCaraNumberInput = (props: INSMVCaraNumberInputProps) => {
  const { initialValue, paAfterBilling, ...restOfTheProps } = props; // extracting  initialValue from props (I want to pass props forward to NumberInput)
  const isModified = props.value !== initialValue;
  const variant = isModified ? "filled" : "default";
  const radius = isModified ? "xl" : "sm";
  const errorString = isModified && paAfterBilling < 0 ? "Pas assez de PA" : ""

  return (
    <INSMVNumberInput {...restOfTheProps} variant={variant} min={1.5} max={9.5} radius={radius} error={errorString} />
  )
};

function Blessures(props: { force: number; faction: Factions; }) {
  const force = props.force;

  let modificateur_faction;
  switch (props.faction) {
    case Factions.ANGES:
      modificateur_faction = 3
      break;
    case Factions.DEMONS:
      modificateur_faction = 2
      break;
    default:
      modificateur_faction = 0
      break;
  }

  let seuil_blessure_legere = modificateur_faction + Math.floor(force);
  let seuil_blessure_grave = 2 * seuil_blessure_legere;
  let seuil_blessure_fatale = 3 * seuil_blessure_legere;
  let seuil_mort_subite = 4 * seuil_blessure_legere;

  const rows = [
    { name: 'bl', gravite: 'Blessure légère', seuil: seuil_blessure_legere },
    { name: 'bg', gravite: 'Blessure grave', seuil: seuil_blessure_grave },
    { name: 'bf', gravite: 'Blessure fatale', seuil: seuil_blessure_fatale },
    { name: 'ms', gravite: 'Mort subite', seuil: seuil_mort_subite },
  ];


  return (
    <Table>
      <thead>
        <tr>
          <th>Gravité</th>
          <th>Seuil</th>
          <th>Nombre actuel</th>
        </tr>
      </thead>
      <tbody>
        {
          rows.map((element) => (
            <tr key={element.name}>
              <td>{element.gravite}</td>
              <td>{element.seuil}</td>
              <td>
                <Radio.Group
                  name={element.name}
                  defaultValue="0"
                >
                  <Radio label="0" value="0" />
                  <Radio label="1" value="1" />
                  <Radio label="2" value="2" />
                  <Radio label="3" value="3" />
                  <Radio label="4" value="4" />
                </Radio.Group>
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}

interface StatusProps {
  pa: number,
  paTotal: number,
  pp: number,
  ppMax: number,
  force: number,
  faction: Factions,

  statusChangeHandler: (updatedState: Partial<IFeuilleDePersoState>) => void

}
function Status(props: StatusProps) {
  const [state, setState] = useSetState({ pa: props.pa, paTotal: props.paTotal, pp: props.pp, ppMax: props.ppMax });

  const statusChangeHandler = (val: number, field: string) => {
    const updatedState: Partial<IFeuilleDePersoState> = { [field]: val };
    setState(updatedState);
    props.statusChangeHandler(updatedState);
  };

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <NumberInput label="Point d'Administration (PA)" value={state.pa} onChange={(val) => { statusChangeHandler(val || 0, "pa") }} />
        <NumberInput label="PA accumulés" value={state.paTotal} onChange={(val) => { statusChangeHandler(val || 0, "paTotal") }} />
        <NumberInput label="Point de Pouvoir (PP)" value={state.pp} onChange={(val) => { statusChangeHandler(val || 0, "pp") }} />
        <NumberInput label="PP Maximum" value={state.ppMax} onChange={(val) => { statusChangeHandler(val || 0, "ppMax") }} />
        <Blessures force={props.force} faction={props.faction} />
      </Group>
    </Stack>
  );
}
function computeCaracCost(finalValue: number, initialValue: number) {
  if (finalValue) {
    const diff = finalValue - initialValue;
    return (diff) * 4;
  } else {
    return 0;
  }
}

type TCaraFuncProps = {
  caracteristiques: TcaracteristiquesSet;
  initialcaracteristiques: TcaracteristiquesSet;
  pa: number;
  onChangeCara: (x: {
    caracteristiques: {[x: string]: number;},
    caraBillingItem: IBillingItem
  }) => void;
}
function Caracteristiques(props: TCaraFuncProps) {
  const [state, setState] = useSetState({
    force: props.caracteristiques.force,
    agilite: props.caracteristiques.agilite,
    perception: props.caracteristiques.perception,
    presence: props.caracteristiques.presence,
    foi: props.caracteristiques.foi,
  });
  const onChangeCara = (val: number, cara: string) => {
    setState({ [cara]: val });
    const caraB : IBillingItem = {
      key: "cara_" + cara,
      msg: [cara] + ": " + props.initialcaracteristiques[cara] + " → " + val,
      cost: computeCaracCost(val, props.initialcaracteristiques[cara])
    };
    const updateMap = {
      caracteristiques: {
        [cara]: val
      },
      caraBillingItem: caraB
    }
    props.onChangeCara(updateMap);

  }

  return (
    <Stack>
      <Title order={2}>Caractéristiques</Title>
      <Group>
        <INSMVCaraNumberInput paAfterBilling={props.pa} label="Force" value={state.force} initialValue={props.initialcaracteristiques.force} onChange={(val: number) => { onChangeCara(val, "force") }} />
        <INSMVCaraNumberInput paAfterBilling={props.pa} label="Agilité" value={state.agilite} initialValue={props.initialcaracteristiques.agilite} onChange={(val: number) => { onChangeCara(val, "agilite") }} />
        <INSMVCaraNumberInput paAfterBilling={props.pa} label="Perception" value={state.perception} initialValue={props.initialcaracteristiques.perception} onChange={(val: number) => { onChangeCara(val, "perception") }} />
        <INSMVCaraNumberInput paAfterBilling={props.pa} label="Présence" value={state.presence} initialValue={props.initialcaracteristiques.presence} onChange={(val: number) => { onChangeCara(val, "presence") }} />
        <INSMVCaraNumberInput paAfterBilling={props.pa} label="Foi" value={state.foi} initialValue={props.initialcaracteristiques.foi} onChange={(val: number) => { onChangeCara(val, "foi") }} />
      </Group>

      {/* <Text>debug force: {props.force}; debug agilite {props.agilite}</Text> */}
    </Stack>

  );

}


function BillingPanel(props:
  {
    billingState: IBillingItem[],
    availablePa: number,
  }) {

  const billingItems = props.billingState;
  const sum = calcBillingItemSum(billingItems);
  const remainingPa = props.availablePa - sum;

  // TODO: sorting billingItems by key or name were would be a good idea

  // maybe use Dialog instead
  return <Dialog opened={true} position={{ top: 20, right: 20 }}>
    <Table>
      <thead>
        <tr>
          <th>PA</th>
          <th>Item</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.availablePa}</td>
          <td> Initial</td>
        </tr>

        {
          billingItems
            .map((billingItem) => {
              if (Object.keys(billingItem).length) {
                return (
                  <tr key={billingItem.key}>
                    <td>-{billingItem.cost}</td>
                    <td>{billingItem.msg}</td>
                    <td>
                      <IconCheck size={16} />
                      <IconX size={16} />
                    </td>
                  </tr>

                );
              } else {
                return;
              }
            })

        }
        <tr>
          <td>{remainingPa}</td>
          <td> total</td>
        </tr>
      </tbody>
    </Table>

  </Dialog>;
}


type TcaracteristiquesSet = {
  [K in "force" | "agilite" | "perception" | "volonte" | "presence" | "foi" as string]: number;
}

interface IPerso {
  identite: string;
  faction: Factions;
  superieur: string;
  grade: number;
  caracteristiques: TcaracteristiquesSet;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;

}
interface IFeuilleDePersoState extends IPerso {
  billingState: IBillingItem[];
  paAfterBilling: number

}
interface IBillingItem {
  key: string,
  msg: string,
  cost: number
}

function calcBillingItemSum(billingItems: IBillingItem[]) {
  let sum = 0;
  if(billingItems){
    for (const billingItem of billingItems) {
      sum += billingItem.cost;
    }  
  }
  return sum;
}

function FeuilleDePerso(props: { perso: IPerso }) {
  const [state, setState] = useSetState<IFeuilleDePersoState>({
    ...props.perso,
    billingState: [],
    paAfterBilling: props.perso.pa
  });

  const updatePaAfterBilling = (billingState: IBillingItem[] , availablePa: number) => {
    const sum = calcBillingItemSum(billingState);
    const updatedPaAfterBilling = availablePa - sum;
    return updatedPaAfterBilling;
  }

  const statusChangeHandler = (updatedState: Partial<IFeuilleDePersoState>) => { 
    let updatedPaAfterBilling = state.paAfterBilling;
    if("pa" in updatedState){
      const availablePa = updatedState.pa || state.paAfterBilling; // defaults to the current state (state.paAfterBilling) in case updatedState.pa is undefined
      updatedPaAfterBilling = updatePaAfterBilling(state.billingState, availablePa);
    }
    

    setState({ ...updatedState, paAfterBilling: updatedPaAfterBilling });
  }

  const caraChangeHandler = (updateMap: { caracteristiques: Pick<TcaracteristiquesSet, keyof TcaracteristiquesSet>; caraBillingItem: IBillingItem; }) => {
    console.log(updateMap);
    // iterate over the current billing state, update if same key is found, otherwise append
    const caraBillingItem = updateMap.caraBillingItem;
    let haveUpdated = false;
    const updatedBillingState = state.billingState.map((billingItem: IBillingItem) => {
      if (billingItem.key === caraBillingItem.key) {
        haveUpdated=true;
        return caraBillingItem;
      } else {
        return billingItem;
      }
    });
    if(!haveUpdated){
      updatedBillingState.push(caraBillingItem);
    }

    const updatedPaAfterBilling = updatePaAfterBilling(updatedBillingState, state.pa);

    setState({
      billingState: updatedBillingState,
      paAfterBilling: updatedPaAfterBilling
    })


    setState({
      caracteristiques: {
        ...state.caracteristiques,
        ...updateMap.caracteristiques
      }
    })
  };


  return (
    <Stack>

      <BillingPanel billingState={state.billingState}
        availablePa={state.pa} />

      <Caracteristiques caracteristiques={state.caracteristiques}
        initialcaracteristiques={props.perso.caracteristiques}
        onChangeCara={caraChangeHandler}
        pa={state.paAfterBilling}
      />
      <Status pa={state.pa} paTotal={state.paTotal}
        pp={state.pp} ppMax={state.ppMax}
        force={state.caracteristiques.force} faction={state.faction}
        statusChangeHandler={statusChangeHandler} />

    </Stack>
  );


}
function App() {

  let initialPerso = {
    identite: "Jean la Mèche",
    faction: Factions.DEMONS,
    superieur: "Baal",
    grade: 3,

    caracteristiques: {
      force: 4,
      agilite: 6,
      perception: 5,
      volonte: 7,
      presence: 1.5,
      foi: 5,
    },
    pa: 12,
    paTotal: 9001,
    pp: 60,
    ppMax: 50,
  }
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <FeuilleDePerso perso={initialPerso} />
    </MantineProvider>
  );
}

export default App;
