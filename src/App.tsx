import './App.css';
import { MantineProvider, NumberInputProps } from '@mantine/core';
import { Button, TextInput, NumberInput, Autocomplete, Stack, Group, Select, Title, Table } from '@mantine/core';
import { Radio, Grid, ActionIcon, Dialog,Text } from '@mantine/core';
import { talents_par_defaut } from './talents';
import { IconPlus, IconMinus, IconRotate, IconCheck, IconX } from '@tabler/icons'
import React, { Component, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useInputState } from '@mantine/hooks';
import { useState } from 'react';
import { useSetState } from '@mantine/hooks';
import { render } from '@testing-library/react';

import { FACTIONS } from './myConst';

const INSMVNumberInput = (props: any) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

const INSMVCaraNumberInput = (props: any) => {

  const {computeCaracCost,initialValue, ...restOfTheProps} = props; // extracting computeCaracCost and initialValue from props (I want to pass props forward to NumberInput)
  const coutPourUneUpgradeDeForce = computeCaracCost(props.value,initialValue);
  const isTooUpgradeExpenseive = coutPourUneUpgradeDeForce > props.pa;
  const variant = props.value === initialValue ? "default" : "filled";
  const errMsg = isTooUpgradeExpenseive ? "Pas assez de PA" : "";

  return (
    <INSMVNumberInput {...restOfTheProps} variant={variant} error={errMsg} min={1.5} max={9.5} />
  )
};

function Blessures(props: { force: number; faction: string; }) {
  const force = props.force;

  let modificateur_faction;
  switch (props.faction) {
    case FACTIONS.ANGES:
      modificateur_faction = 3
      break;
    case FACTIONS.DEMONS:
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

function Status2(props:any){
  const [state, setState] = useSetState({pa: props.pa, paTotal: props.paTotal});

  const statusChangeHandler = (val: number, field:string) => {
    const updatedState : Partial<IAssistantState> = {[field]: val};
    setState(updatedState);
    props.statusChangeHandler(updatedState);
  };

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <NumberInput label="Point d'Administration (PA)" value={state.pa} onChange={(val)=>{statusChangeHandler(val||0, "pa")}} />
        {/* <NumberInput label="PA accumulés" value={state.paTotal} onChange={(val)=>{statusChangeHandler(val||0, "paTotal")}} /> */}
        {/* <NumberInput label="Point de Pouvoir (PP)" value={this.props.pp} onChange={this.props.handlePpChange} />
        <NumberInput label="PP Maximum" value={this.props.ppMax} onChange={this.props.handlePpMaxChange} />
        <Text>debug force: {this.props.force}</Text> */}
        <Blessures force={props.force} faction={props.faction} />
      </Group>
    </Stack>
  );
}
function computeCaracCost(finalValue:number, initialValue:number){
  if(finalValue){
    const diff = finalValue-initialValue;
    return (diff)*4;  
  }else{
    return 0;
  }
}

type TCaraFuncProps = {
  caracteristiques: TcaracteristiquesSet;
  initialcaracteristiques: TcaracteristiquesSet;
  pa: number;
  onChangeCara: (x:any)=>void;
}
function Caracteristiques(props:TCaraFuncProps){
  const [state, setState] = useSetState({
    force: props.caracteristiques.force,
    agilite: props.caracteristiques.agilite,
    perception: props.caracteristiques.perception,
    presence: props.caracteristiques.presence,
    foi: props.caracteristiques.foi,
  });
  const onChangeCara = (val:number, cara:string) => {
    setState({[cara]: val});

    const updateMap = {
      caracteristiques: {
        [cara]: val
      },
      caraBillingItem:{
        [cara]:{
          msg: [cara]+": "+props.caracteristiques[cara]+"->"+val,
          cost: computeCaracCost(val,props.caracteristiques[cara])
        }
      }
    }
    props.onChangeCara(updateMap);
  }

    return (
      <Stack>
        <Title order={2}>Caractéristiques</Title>
        <Group>
          <INSMVCaraNumberInput label="Force" value={state.force} initialValue={props.initialcaracteristiques.force} onChange={(val: number)=>{onChangeCara(val, "force")}} computeCaracCost={computeCaracCost} pa={props.pa} />
          <INSMVCaraNumberInput label="Agilité" value={state.agilite} initialValue={props.initialcaracteristiques.agilite} onChange={(val: number)=>{onChangeCara(val, "agilite")}} computeCaracCost={computeCaracCost} pa={props.pa} />
          <INSMVCaraNumberInput label="Perception" value={state.perception} initialValue={props.initialcaracteristiques.perception} onChange={(val: number)=>{onChangeCara(val, "perception")}} computeCaracCost={computeCaracCost} pa={props.pa} />
          <INSMVCaraNumberInput label="Présence" value={state.presence} initialValue={props.initialcaracteristiques.presence} onChange={(val: number)=>{onChangeCara(val, "presence")}} computeCaracCost={computeCaracCost} pa={props.pa} />
          <INSMVCaraNumberInput label="Foi" value={state.foi} initialValue={props.initialcaracteristiques.foi} onChange={(val: number)=>{onChangeCara(val, "foi")}} computeCaracCost={computeCaracCost} pa={props.pa} />
        </Group>

        {/* <Text>debug force: {props.force}; debug agilite {props.agilite}</Text> */}
      </Stack>
  
   ); 

}

function PersistentPanel(props:any) {

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
        {/* {
        props.billingItems.map((billingItem:any)=>{
          <tr>
            <td>{billingItem.cost}</td>
            <td>{billingItem.msg}</td>

          </tr>
        })
        
        } */}
        <tr>
          <td>1337</td>
          <td> initial</td>
        </tr>
        <tr>
          <td>-4</td>
          <td> caracteristiquess</td>
          <td>
            <IconCheck size={12} />
            <IconX size={12} />
          </td>
        </tr>
        <tr>
          <td>24</td>
          <td> total</td>
          <td>
            <IconCheck size={12} />
            <IconX size={12} />
          </td>
        </tr>
      </tbody>
    </Table>

  </Dialog>;
}


type TcaracteristiquesSet = {
  [K in "force"|"agilite"|"perception"|"volonte"|"presence"|"foi" as string] : number;
  // force: number;
  // agilite: number;
  // perception: number;
  // volonte: number;
  // presence: number;
  // foi: number;  
}

interface IPerso{
  identite: string;
  faction: string;
  superieur: string;
  grade: number;
  caracteristiques : TcaracteristiquesSet;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;  

}
interface IAssistantProps {
  perso: IPerso;
}
interface IAssistantState extends IPerso{
  billingState?: {
    caracteristiquess?: IBillingItem[],
    talents?: IBillingItem[],
    pouvoirs?:IBillingItem[]
  };

}
interface IBillingItem{
  msg: string,
  cost: number
}

class AssistantFunc(props){
  
}
  class Assistant3 extends React.Component<IAssistantProps, IAssistantState> {

  onChangeCaraAndBilling: (updateMap:  {[key: string]: any}) => void;
  statusChangeHandler: (updatedState: Pick<IAssistantState, keyof IAssistantState>) => void; // initially used Partial<IAssistantState>, but we cannot use this, see https://stackoverflow.com/questions/59737459/react-typescript-how-to-update-state-with-single-object-with-a-dynamic-set
  constructor(props: IAssistantProps) {
    super(props);
    this.state = {...props.perso,
    billingState: {}
  };

    this.onChangeCaraAndBilling = (updateMap) => {
      console.log(updateMap);

      this.setState({
        caracteristiques:{
          ...this.state.caracteristiques,
          ...updateMap.caracteristiques
        }
      })


    }; 

    this.statusChangeHandler = (updatedState) =>{
      this.setState(updatedState);
    }
  }
  
  render() {
    return (
      <Stack>

        {/* <CreatureProportion size={3} weight={6} /> */}
        <CaracteristiquesFunc caracteristiques={this.state.caracteristiques}
        initialcaracteristiques={this.props.perso.caracteristiques}
          onChangeCara = {this.onChangeCaraAndBilling}
          pa={this.state.pa}
        />
        <Status2 pa={this.state.pa} paTotal={this.state.paTotal} statusChangeHandler={this.statusChangeHandler}
        force={this.state.caracteristiques.force} faction={this.state.faction} />

      </Stack>
    );
  }
}

function App() {

  let initialPerso = {
    identite: "Jean la Mèche",
    faction: FACTIONS.DEMONS,
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
      <Assistant3 perso={initialPerso} />
    </MantineProvider>
  );
}

export default App;
