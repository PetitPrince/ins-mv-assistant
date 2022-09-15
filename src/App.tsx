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
import { Blessures, Status } from './Status';
import { Caracteristiques } from './Caracteristique';

export const INSMVNumberInput = (props: NumberInputProps) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};


function BillingPanel(props:
  {
    billingState: IBillingItem[],
    availablePa: number,
    cancelThisBillableItem: (key: string) => void;
  }) {

  const billingItems = props.billingState;
  const sum = calcBillingItemSum(billingItems);
  const remainingPa = props.availablePa - sum;
  const deleteTheStuffHandler = (key: string) => {
    props.cancelThisBillableItem(key);
  };

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
                      <ActionIcon onClick={(x: any) => deleteTheStuffHandler(billingItem.key)}>
                        <IconX size={16} />
                      </ActionIcon>
                      <ActionIcon>
                        <IconCheck size={16} />
                      </ActionIcon>
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
          <td>
            <ActionIcon>
              <IconCheck size={16} />
            </ActionIcon>
          </td>
        </tr>
      </tbody>
    </Table>

  </Dialog>;
}


export type TcaracteristiquesSet = {
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
export interface IFeuilleDePersoState extends IPerso {
  billingState: IBillingItem[];
  paAfterBilling: number

}
export interface IBillingItem {
  key: string,
  msg: string,
  cost: number
}

function calcBillingItemSum(billingItems: IBillingItem[]) {
  let sum = 0;
  if (billingItems) {
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

  const updatePaAfterBilling = (billingState: IBillingItem[], availablePa: number) => {
    const sum = calcBillingItemSum(billingState);
    const updatedPaAfterBilling = availablePa - sum;
    return updatedPaAfterBilling;

  }

  const statusChangeHandler = (updatedState: Partial<IFeuilleDePersoState>) => {
    let updatedPaAfterBilling = state.paAfterBilling;
    if ("pa" in updatedState) {
      const availablePa = updatedState.pa || state.paAfterBilling; // defaults to the current state (state.paAfterBilling) in case updatedState.pa is undefined
      updatedPaAfterBilling = updatePaAfterBilling(state.billingState, availablePa);
    }


    setState({ ...updatedState, paAfterBilling: updatedPaAfterBilling });
  }

  const caraChangeHandler = (updateMap: { caracteristiques: Pick<TcaracteristiquesSet, keyof TcaracteristiquesSet>; caraBillingItem: IBillingItem; }) => {
    // iterate over the current billing state, update if same key is found, otherwise append
    const caraBillingItem = updateMap.caraBillingItem;
    let haveUpdated = false;
    const updatedBillingState = state.billingState.map((billingItem: IBillingItem) => {
      if (billingItem.key === caraBillingItem.key) {
        haveUpdated = true;
        return caraBillingItem;
      } else {
        return billingItem;
      }
    });
    if (!haveUpdated) {
      updatedBillingState.push(caraBillingItem);
    }

    const updatedPaAfterBilling = updatePaAfterBilling(updatedBillingState, state.pa);

    setState({
      billingState: updatedBillingState,
      paAfterBilling: updatedPaAfterBilling,
      caracteristiques: {
        ...state.caracteristiques,
        ...updateMap.caracteristiques
      }
    })
  };

  const cancelThisBillableItem = (key: string) => {
    console.log(key);
    const updatedBillingState = state.billingState.filter(x => x.key !== key);
    const updatedPaAfterBilling = updatePaAfterBilling(updatedBillingState, state.pa);
    let updatedState: Partial<IFeuilleDePersoState> = {
      billingState: updatedBillingState,
      paAfterBilling: updatedPaAfterBilling,
    };


    if (key.startsWith("cara_")) {
      const caraKey = key.split("cara_")[1];
      const updatedCaracteristique = { ...state.caracteristiques, [caraKey]: props.perso.caracteristiques[caraKey] }
      updatedState = { ...updatedState, caracteristiques: updatedCaracteristique };
      caraSetState(updatedCaracteristique);
    }

    setState(updatedState);

  }


  const [caraState, caraSetState] = useSetState({
    force: props.perso.caracteristiques.force,
    agilite: props.perso.caracteristiques.agilite,
    perception: props.perso.caracteristiques.perception,
    presence: props.perso.caracteristiques.presence,
    foi: props.perso.caracteristiques.foi,
  });


  return (
    <Stack>

      <BillingPanel
        billingState={state.billingState}
        availablePa={state.pa}
        cancelThisBillableItem={cancelThisBillableItem}
      />

      <Caracteristiques caracteristiques={state.caracteristiques}
        initialcaracteristiques={props.perso.caracteristiques}
        caraState={caraState}
        caraSetState={caraSetState}
        pa={state.paAfterBilling}
        onChangeCara={caraChangeHandler}
      />
      <Status pa={state.pa} paTotal={state.paTotal}
        pp={state.pp} ppMax={state.ppMax}
        force={state.caracteristiques.force} faction={state.faction}
        statusChangeHandler={statusChangeHandler}
      />

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
