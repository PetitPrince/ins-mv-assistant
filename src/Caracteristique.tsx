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
import { INSMVNumberInput, TcaracteristiquesSet, IBillingItem } from './App'

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
    caraState: TcaracteristiquesSet,
    initialcaracteristiques: TcaracteristiquesSet;
    pa: number;
    onChangeCara: (x: {
        caracteristiques: { [x: string]: number; },
        caraBillingItem: IBillingItem
    },
    ) => void;
    caraSetState: (x:TcaracteristiquesSet) => void,

}
export function Caracteristiques(props: TCaraFuncProps) {
    // const [state, setState] = useSetState({
    //     force: props.caracteristiques.force,
    //     agilite: props.caracteristiques.agilite,
    //     perception: props.caracteristiques.perception,
    //     presence: props.caracteristiques.presence,
    //     foi: props.caracteristiques.foi,
    // });
    const onChangeCara = (val: number, cara: string) => {
        props.caraSetState({ [cara]: val });
        const caraB: IBillingItem = {
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
                <INSMVCaraNumberInput paAfterBilling={props.pa} label="Force" value={props.caraState.force} initialValue={props.initialcaracteristiques.force} onChange={(val: number) => { onChangeCara(val, "force") }} />
                <INSMVCaraNumberInput paAfterBilling={props.pa} label="Agilité" value={props.caraState.agilite} initialValue={props.initialcaracteristiques.agilite} onChange={(val: number) => { onChangeCara(val, "agilite") }} />
                <INSMVCaraNumberInput paAfterBilling={props.pa} label="Perception" value={props.caraState.perception} initialValue={props.initialcaracteristiques.perception} onChange={(val: number) => { onChangeCara(val, "perception") }} />
                <INSMVCaraNumberInput paAfterBilling={props.pa} label="Présence" value={props.caraState.presence} initialValue={props.initialcaracteristiques.presence} onChange={(val: number) => { onChangeCara(val, "presence") }} />
                <INSMVCaraNumberInput paAfterBilling={props.pa} label="Foi" value={props.caraState.foi} initialValue={props.initialcaracteristiques.foi} onChange={(val: number) => { onChangeCara(val, "foi") }} />
            </Group>

            {/* <Text>debug force: {props.force}; debug agilite {props.agilite}</Text> */}
        </Stack>

    );

}