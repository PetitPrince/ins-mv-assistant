import './App.css';
import { MantineProvider, NumberInputProps } from '@mantine/core';
import { Button, TextInput, NumberInput, Autocomplete, Stack, Group, Select, Title, Table } from '@mantine/core';
import { Radio, Grid, ActionIcon } from '@mantine/core';
import { talents_par_defaut } from './talents';
import { IconPlus, IconMinus, IconRotate, IconCheck, IconX } from '@tabler/icons'
import React, { Component } from 'react';
// import { render } from 'react-dom';



const FACTIONS = {
  "ANGES": "Anges",
  "DEMONS": "Démons",
  "TROISIEME_FORCE": "Troisième force",
  "AUTRE": "Autres",
}

class Pouvoir {
  name: String;
  powerType: String;
  ppCost: string;
  paCost: number;
  restriction: any;
  level: number;
  constructor(name: string, powerType: string, ppCost: string, paCost: number, restriction: string | null, level: number) {
    this.name = name;
    this.powerType = powerType;
    this.ppCost = ppCost;
    this.paCost = paCost;
    this.restriction = restriction;
    this.level = level;
  }
}

const TALENTS = {
  "PRINCIPAUX": "Talents principaux",
  "EXOTIQUES": "Talents exotique",
  "SECONDAIRES": "Talents secondaire"
}
class TalentStandard {
  name: string;
  associatedChara: string;
  specialisationType: string;
  isInnate: boolean;
  talentType: string;
  // restriction: string;
  constructor(name: string, associatedChara: string, specialisationType: string, isInnate: boolean, talentType: string,
    // restriction: string
  ) {
    /**
     * Two modes of working: only name and level
     */
    this.name = name;
    this.associatedChara = associatedChara;
    this.specialisationType = specialisationType;
    this.isInnate = isInnate;
    this.talentType = talentType;
    // this.restriction = restriction;
  }

  static fromJson(json: {
    nom: string; caracteristique_associe: string; specialisation: string; inne: boolean; type: string;
    //  restriction: string;
  }) {
    return new TalentStandard(json.nom, json.caracteristique_associe, json.specialisation, json.inne, json.type,
      // json.restriction
    )
  }
}

const all_the_talents = talents_par_defaut.map(TalentStandard.fromJson);

const TALENTS_PRINCIPAUX_STANDARD = all_the_talents.filter((talent) => { return talent.talentType === "Principal"; })
const TALENTS_SECONDAIRES_STANDARD = all_the_talents.filter((talent) => { return talent.talentType === "Secondaire"; })
const TALENTS_EXOTIQUES_STANDARD = all_the_talents.filter((talent) => { return talent.talentType === "Exotique"; })
const SUPERIEURS_ANGES = [
  "Alain, archange des cultures",
  "Blandine, archange des rêves",
  "Christophe, archanges des enfants",
  "Daniel, archange de la pierre",
  "Didier, archange de la communication",
  "Dominique, archange de la justice",
  "Francis, archange de la diplomatie",
  "Guy, archange des guérisseurs",
  "Jean, archange de la foudre",
  "Jean-Luc, archange des protecteurs",
  "Jordi, archange des animaux",
  "Joseph, archange de l'inquisition",
  "Laurent, archange de l'épée",
  "Marc, archange des échanges",
  "Mathias, archange du double jeu",
  "Michel, archange de la guerre",
  "Novalis, archange des fleurs",
  "Walther, archange des exorcistes",
  "Yves, archange des sources"
]
const SUPERIEURS_DEMONS = [
  "Abalam, prince de la folie",
  "Andrealphus, prince du sexe",
  "Andromalius, prince du jugement",
  "Asmodée, prince du jeu",
  "Baal, prince de la guerre",
  "Baalberith, prince des messagers",
  "Beleth, prince des cauchemars",
  "Belial, prince du feu",
  "Bifrons, prince des morts",
  "Caym, prince des animaux",
  "Corocell, prince du froid",
  "Furfur, prince du hardcore",
  "Gaziel, prince de la terre",
  "Haagenti, prince de la gourmandise",
  "Kobal, prince de l'humour noir",
  "Kronos, prince de l'éternité",
  "Malphas, prince de la discorde",
  "Malthus, prince des maladies",
  "Mammon, prince de la cupidité",
  "Morax, prince des dons artistiques",
  "Nisroch, prince des drogues",
  "Nox, prince de la paresse",
  "Nybbas, prince des médias",
  "Ouikka, prince des airs",
  "Samigina, prince de vampires",
  "Scox, prince des âmes",
  "Shaytan, prince de la laideur",
  "Uphir, prince de la pollution",
  "Valefor, prince des voleurs",
  "Vapula, prince de la technologie",
  "Vephar, prince des océans"
]
// ----------------------------------------------------

const INSMVNumberInput = (props: JSX.IntrinsicAttributes & NumberInputProps & React.RefAttributes<HTMLInputElement>) => {
  return (
    <NumberInput {...props} step={0.5} precision={1} />
  );
};

const INSMVCaraNumberInput = (props: JSX.IntrinsicAttributes & NumberInputProps & React.RefAttributes<HTMLInputElement>) => {
  return (
    <INSMVNumberInput {...props} min={1.5} max={9.5} />
  )
};

// ----------------------------------------------------


function Identite(props: {
  value: string;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}
) {
  return (<TextInput
    label="Identité"
    value={props.value}
    onChange={props.onChangeHandler}
  />);
}


function Faction(props: { value: string | null; onChangeHandler: ((value: string | null) => void) | undefined; }) {
  return (
    <Select
      id="faction"
      label="Faction"
      value={props.value}
      onChange={props.onChangeHandler}

      data={[
        { value: FACTIONS.ANGES, label: FACTIONS.ANGES },
        { value: FACTIONS.DEMONS, label: FACTIONS.DEMONS },
        { value: FACTIONS.TROISIEME_FORCE, label: FACTIONS.TROISIEME_FORCE },
        { value: FACTIONS.AUTRE, label: FACTIONS.AUTRE }
      ]}
    />);
}

function Superieur(props: { faction: string; onChangeHandler: ((value: string) => void) | undefined; value: string | undefined; }) {
  let superieurs;
  switch (props.faction) {
    case FACTIONS.ANGES:
      superieurs = SUPERIEURS_ANGES;
      break;
    case FACTIONS.DEMONS:
      superieurs = SUPERIEURS_DEMONS;
      break;
    default:
      superieurs = ['']
      break;
  }

  return (
    <Autocomplete
      onChange={props.onChangeHandler}
      id="superieur"
      data={superieurs}
      label="Supérieur"
      limit={1000}
      value={props.value}
    />
  );
}
function Grade(props: { value: number | undefined; onChangeHandler: ((value: number | undefined) => void) | undefined; }) {
  return (
    <NumberInput
      label="Grade"
      min={0}
      max={3}
      value={props.value}
      onChange={props.onChangeHandler}

    />
  );
}
class Generalites extends React.Component {
  props: any;
  render() {
    return (
      <Stack>
        <Title order={2}>Généralités</Title>
        {/* <Button onClick={printFeed}>Print feedback</Button> */}
        <Group>
          <Identite value={this.props.identite} onChangeHandler={this.props.handleIdentiteChange} />
          <Faction value={this.props.faction} onChangeHandler={this.props.handleFactionChange} />
          <Superieur value={this.props.superieur} faction={this.props.faction} onChangeHandler={this.props.handleSuperieurChange} />
          <Grade value={this.props.grade} onChangeHandler={this.props.handleGradeChange} />
        </Group>
      </Stack>
    )
  }

}



// ----------------------------------------------------

class Caracteristiques extends React.Component {
  props: any;
  render() {
    return (
      <Stack>
        <Title order={2}>Caractéristiques</Title>
        <Group>
          <INSMVCaraNumberInput label="Force" value={this.props.force} onChange={this.props.handleForceChange} />
          <INSMVCaraNumberInput label="Agilité" value={this.props.agilite} onChange={this.props.handleAgiliteChange} />
          <INSMVCaraNumberInput label="Perception" value={this.props.perception} onChange={this.props.handlePerceptionChange} />
          <INSMVCaraNumberInput label="Volonté" value={this.props.volonte} onChange={this.props.handleVolonteChange} />
          <INSMVCaraNumberInput label="Présence" value={this.props.presence} onChange={this.props.handlePresenceChange} />
          <INSMVCaraNumberInput label="Foi" value={this.props.foi} onChange={this.props.handleFoiChange} />
        </Group>
      </Stack>

    );
  }
}


// ----------------------------------------------------
interface StatusProps {
  pa: number;
  handlePaChange: (val: number) => void;
  paTotal: number;
  handlePaTotalChange: (val: number) => void;
  ppMax: number;
  handlePpMaxChange: (val: number) => void;
  pp: number;
  handlePpChange: (val: number) => void;
  force: number;
  faction: string;

}
interface StatusState {

}
class Status extends React.Component<StatusProps, StatusState> {
  constructor(props: StatusProps) {
    super(props);

  }

  render() {
    return (
      <Stack>
        <Title order={2}>Status</Title>
        <Group>
          <NumberInput label="Point d'Administration (PA)" value={this.props.pa} onChange={this.props.handlePaChange} />
          <NumberInput label="PA accumulés" value={this.props.paTotal} onChange={this.props.handlePaTotalChange} />
          <NumberInput label="Point de Pouvoir (PP)" value={this.props.pp} onChange={this.props.handlePpChange} />
          <NumberInput label="PP Maximum" value={this.props.ppMax} onChange={this.props.handlePpMaxChange} />
          <Blessures force={this.props.force} faction={this.props.faction} />
        </Group>
      </Stack>

    );
  }
}

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

// ----------------------------------------------------

class TalentTableRow {
  name: string;
  id: string;
  level: number | undefined;
  carac: string;
  constructor(name: string, level: number, carac: string) {
    this.name = name;
    this.id = name; // todo: maybe this should be explicit ?
    this.level = level;
    this.carac = carac;
  }
}

const TALENT_SPACER = " — ";
function computeTalentRow(characterTalents: any[], standardTalents: TalentStandard[]) { // TODO: fix type
  let rows = []
  // Go through the list of standard talents (display all, in case of level up; show/hide should be a user choice)
  // One exception is exotic talents -> make a specific method just for it
  for (const standardTalent of standardTalents) {
    const standardTalentName = standardTalent.name;
    const associatedCara = standardTalent.associatedChara;
    const specialisation = standardTalent.specialisationType;
    const isSpecifique = standardTalent.specialisationType === "Spécifique";
    let level = null;
    let rowName = standardTalentName;
    switch (specialisation) {
      case "Spécifique":
      case "Multiple": // TODO: may have to refactor for the multiple case
        const characterTalentFamily = characterTalents.filter(t => t.name.startsWith(standardTalent.name));
        if (characterTalentFamily.length > 0) {
          for (const characterTalent of characterTalentFamily) {
            const characterTalentName = characterTalent.name;
            const spacer = (isSpecifique && (characterTalentName === standardTalentName)) ? "" : TALENT_SPACER;
            level = characterTalent.level;
            rowName = spacer + characterTalentName;
            rows.push(new TalentTableRow(rowName, level, associatedCara))
          }
        } else {
          rowName = standardTalent.name;
          rows.push(new TalentTableRow(rowName, 0, associatedCara))
        }
        break;
      case "Générique":
      default:
        const isCurrentStandardTalentPresentInCharacterSheet = characterTalents.map(el => el.name).includes(standardTalentName);
        if (isCurrentStandardTalentPresentInCharacterSheet) {
          level = characterTalents.find(el => el.name === standardTalentName).level;
        }
        rowName = standardTalentName;
        rows.push(new TalentTableRow(rowName, level, associatedCara))        
        break;
    }
    
  }
  return rows;
}
interface TalentsPrincipauxProps {
  talentsPrincipauxDuPerso: TalentDescForStandard[]
  handleTalentChange: (talent: TalentDescForStandard) => void
}
interface TalentsPrincipauxState {
  rows: TalentTableRow[]
}
class TalentsPrincipaux extends (React.Component)<TalentsPrincipauxProps, TalentsPrincipauxState> {
  constructor(props: TalentsPrincipauxProps) {
    super(props);

    let rows = computeTalentRow(this.props.talentsPrincipauxDuPerso, TALENTS_PRINCIPAUX_STANDARD);
    this.state = { "rows": rows };

    this.handleTalentReset = this.handleTalentReset.bind(this);
    this.handleOneTalentChange = this.handleOneTalentChange.bind(this)

  }

  handleOneTalentChange(talentId: string) {
    const talentName = talentId.split(TALENT_SPACER).pop(); // split().pop() removes the display modifier
    const talentToUpdate = this.state.rows.find(item=>item.name===talentId);
    if(talentToUpdate){
      this.props.handleTalentChange({
        name: talentToUpdate.name,
        level: talentToUpdate.level
      });
    }
  }

  handleTalentReset(talentId: string) {
    // state is current one
    // props is last one
    const talentName = talentId.split(TALENT_SPACER).pop(); // split().pop() removes the display modifier
    const maybeTalent=this.props.talentsPrincipauxDuPerso.find(x => x.name === talentName);
    const updatedLevel = maybeTalent ? maybeTalent.level : undefined;

    let newState = {
      rows: this.state.rows.map(item => { // update the object with the name of interest, otherwise copy
        if (item.name === talentId) {
          let newItem = item;
          newItem.level = updatedLevel;
          return newItem;

        } else {
          return item;
        }
      })
    };
    this.setState(newState);
  }

  render() {
    return (
      <Stack>
        <Title order={3}>Talents principaux</Title>
        <Table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Niveau</th>
              <th>Carac</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{
            this.state.rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td><INSMVNumberInput value={row.level} min={0}
                  onChange={(val: number) => this.setState({
                    rows: this.state.rows.map(item => {
                      if (item.name === row.name) {
                        let newItem = item;
                        newItem.level = val;
                        return newItem;

                      } else {
                        return item;
                      }
                    })

                  })}
                /> </td>
                <td>{row.carac}</td>
                <td>
                  <ActionIcon
                    color="dark"
                    variant="outline"
                    onClick={() => this.handleOneTalentChange(row.name)}
                  >
                    <IconCheck size={12} />
                  </ActionIcon>
                  <ActionIcon
                    color="dark"
                    variant="outline"
                    onClick={() => this.handleTalentReset(row.name)}

                  >
                    <IconX size={12} />
                  </ActionIcon>
                </td>
              </tr>
            ))
          }</tbody>
        </Table>
      </Stack>
    );
  }
}

interface TalentsSecondairesProps {
  talentsSecondairesDuPerso: TalentDescForStandard[]
  handleTalentChange: (talent: TalentDescForStandard) => void
}
interface TalentsSecondairesState {
  rows: TalentTableRow[]
}

class TalentsSecondaires extends (React.Component)<TalentsSecondairesProps, TalentsSecondairesState> {
  constructor(props: TalentsSecondairesProps) {
    super(props)

    let rows = computeTalentRow(this.props.talentsSecondairesDuPerso, TALENTS_SECONDAIRES_STANDARD);

    this.state = { "rows": rows };

    this.handleTalentReset = this.handleTalentReset.bind(this);
    this.handleOneTalentChange = this.handleOneTalentChange.bind(this)

  }

  handleOneTalentChange(talentId: string) {
    const talentName = talentId.split(TALENT_SPACER).pop(); // split().pop() removes the display modifier
    const talentToUpdate = this.state.rows.find(item=>item.name===talentId);
    if(talentToUpdate){
      this.props.handleTalentChange({
        name: talentToUpdate.name,
        level: talentToUpdate.level
      });
    }
  }

  handleTalentReset(talentId: string) {
    // state is current one
    // props is last one
    const talentName = talentId.split(TALENT_SPACER).pop(); // split().pop() removes the display modifier
    const maybeTalent=this.props.talentsSecondairesDuPerso.find(x => x.name === talentName);
    const updatedLevel = maybeTalent ? maybeTalent.level : undefined;

    let newState = {
      rows: this.state.rows.map(item => { // update the object with the name of interest, otherwise copy
        if (item.name === talentId) {
          let newItem = item;
          newItem.level = updatedLevel;
          return newItem;

        } else {
          return item;
        }
      })
    };
    this.setState(newState);
  }

  render(): React.ReactNode {
    return (
      <Stack>
        <Title order={3}>Talents secondaires</Title>
        <Table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Niveau</th>
              <th>Carac</th>
            </tr>
          </thead>
          <tbody>{
            this.state.rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td><INSMVNumberInput value={row.level} min={0}
                  onChange={(val: number) => this.setState({
                    rows: this.state.rows.map(item => {
                      if (item.name === row.name) {
                        let newItem = item;
                        newItem.level = val;
                        return newItem;

                      } else {
                        return item;
                      }
                    })

                  })}
                /> </td>
                <td>{row.carac}</td>
                <td>
                  <ActionIcon
                    color="dark"
                    variant="outline"
                    onClick={() => this.handleOneTalentChange(row.name)}
                  >
                    <IconCheck size={12} />
                  </ActionIcon>
                  <ActionIcon
                    color="dark"
                    variant="outline"
                    onClick={() => this.handleTalentReset(row.name)}

                  >
                    <IconX size={12} />
                  </ActionIcon>
                </td>


              </tr>
            ))
          }</tbody>
        </Table>
      </Stack>
    );    
  }
}


function computeExoticTalentRows(characterTalents: any, standardExoticTalents: any[]) {
  /**
   * This one should behave a bit like computeTalent in a first part (where it checks for standard exotic talent), but then
   * should populate (calc ?) the fully custom talents.
   * 
   * So the logic is bit modified where unlike the other we don't want to display everything for everyone (Kama sutra for
   *  Andromalius ? Torture for Christophe ?).
   * 
   * Hence we only loop through the input
   */

  let rows = [];
  for (const oneExoticTalent of characterTalents) {
    const talentName = oneExoticTalent.name;
    const isStandard = standardExoticTalents
      .map(el => el.name) // TODO: it's not necessary "name" but can be "nom". I should decide if I want to use the class representation or the raw representation someday...
      .includes(talentName);
    const level = oneExoticTalent.level;
    if (isStandard) {
      const standardTalentDef = standardExoticTalents.find(el => el.name === talentName); // should be guaranteed
      rows.push(new TalentTableRow(talentName, level, standardTalentDef.specialisationType));
    } else {
      const asoaciatedCharac = oneExoticTalent.associatedChara;
      rows.push(new TalentTableRow(talentName, level, asoaciatedCharac));
    }
  }
  return rows;
}

function TalentsExotiques(props: { talentsExotiquesDuPerso: any; }) {
  let rows = computeExoticTalentRows(props.talentsExotiquesDuPerso, TALENTS_EXOTIQUES_STANDARD);
  return (
    <Stack>
      <Title order={3}>Talents exotiques</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Carac</th>
          </tr>
        </thead>
        <tbody>{
          rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.level}</td>
              <td>{row.carac}</td>
            </tr>
          ))
        }</tbody>
      </Table>
    </Stack>
  );
}

interface TalentDescForStandard {
  name: string,
  level: number | undefined
}
interface TalentDescForCustom {
  name: string,
  level: number,
  associatedChara: string,
  isInnate: boolean
}

interface TalentsProps {
  talentsPrincipauxDuPerso: TalentDescForStandard[],
  talentsExotiquesDuPerso: TalentDescForCustom[],
  talentsSecondairesDuPerso: TalentDescForStandard[],
}
interface TalentsState {
  talentsPrincipaux: TalentDescForStandard[],
  talentsExotiques: TalentDescForCustom[],
  talentsSecondaires: TalentDescForStandard[],
}

class Talents extends React.Component<TalentsProps, TalentsState> {
  constructor(props: TalentsProps) {
    super(props);

    this.state = {
      talentsPrincipaux: props.talentsPrincipauxDuPerso,
      talentsExotiques: props.talentsExotiquesDuPerso,
      talentsSecondaires: props.talentsSecondairesDuPerso
    }

    
    this.handleOnePrimaryTalentChange = this.handleOnePrimaryTalentChange.bind(this);
    this.handleOneSecondaryTalentChange = this.handleOneSecondaryTalentChange.bind(this);

  }

  handleOnePrimaryTalentChange(talent: TalentDescForStandard){
    const newTalentName = talent.name;
    const newTalentLevel = talent.level;

    let updatedTalentsPrincipaux = this.state.talentsPrincipaux;
    if(updatedTalentsPrincipaux.find(x=>x.name === newTalentName)){
      updatedTalentsPrincipaux = updatedTalentsPrincipaux.map(item => {
        if (item.name === newTalentName) {
          let newItem = item;
          newItem.level = newTalentLevel;
          return newItem;
  
        } else {
          return item;
        }
      });
    }else{
      updatedTalentsPrincipaux.push(
        {
          name: newTalentName,
          level: newTalentLevel
        }
      )
    }
    let newState = {
      talentsPrincipaux : updatedTalentsPrincipaux,
    };

    this.setState(newState);
  }

  handleOneSecondaryTalentChange(talent: TalentDescForStandard){
    const newTalentName = talent.name;
    const newTalentLevel = talent.level;

    let updatedTalentsSecondaires = this.state.talentsSecondaires;
    if(updatedTalentsSecondaires.find(x=>x.name === newTalentName)){
      updatedTalentsSecondaires = updatedTalentsSecondaires.map(item => {
        if (item.name === newTalentName) {
          let newItem = item;
          newItem.level = newTalentLevel;
          return newItem;
  
        } else {
          return item;
        }
      });
    }else{
      updatedTalentsSecondaires.push(
        {
          name: newTalentName,
          level: newTalentLevel
        }
      )
    }
    let newState = {
      talentsSecondaires : updatedTalentsSecondaires,
    };

    this.setState(newState);
  }

  render() {
    return (
      <Stack>
        <Title order={2}>Talents</Title>
        <Grid>
          <Grid.Col span={4}>
            <TalentsPrincipaux
              talentsPrincipauxDuPerso={this.state.talentsPrincipaux}
              handleTalentChange={this.handleOnePrimaryTalentChange}
            // onClick={(i: any) => this.handleTalentsPrincipauxClick(i)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TalentsExotiques talentsExotiquesDuPerso={this.props.talentsExotiquesDuPerso} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TalentsSecondaires
             talentsSecondairesDuPerso={this.props.talentsSecondairesDuPerso} 
             handleTalentChange={this.handleOneSecondaryTalentChange}
             />
          </Grid.Col>
        </Grid>
      </Stack>

    );
  }
}

// ----------------------------------------------------

class PowerTableRow {
  name: string;
  id: string;
  level: number;
  ppCost: number;
  constructor(name: string, level: number, ppCost: number) {
    this.name = name;
    this.id = name; // todo: maybe this should be explicit ?
    this.level = level;
    this.ppCost = ppCost;
  }
}

function computePouvoirRows(characterPowers: any, standardPowers: null) {
  // Way to many powers, so i'm using the exotic talents approach

  let rows = [];
  for (const onePower of characterPowers) {
    rows.push(new PowerTableRow(onePower.name, onePower.level, onePower.ppCost));

  }

  return rows;
}
function Pouvoirs(props: { pouvoirsDuPerso: any; }) {
  let rows = computePouvoirRows(props.pouvoirsDuPerso, null);

  return (
    <Stack>
      <Title order={2}>Pouvoirs</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Coût en PP</th>
          </tr>
        </thead>
        <tbody>{
          rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.level}</td>
              <td>{row.ppCost}</td>
            </tr>
          ))
        }</tbody>
      </Table>
    </Stack>
  );
}

// ====================================================

interface AssistantState {
  identite: string;
  faction: string;
  superieur: string;
  grade: number;
  force: number;
  agilite: number;
  perception: number;
  volonte: number;
  presence: number;
  foi: number;
  pa: number;
  paTotal: number;
  pp: number;
  ppMax: number;
}
interface AssistantProps {

}

class Assistant extends React.Component<AssistantProps, AssistantState> {
  state: {
    identite: string;
    faction: string;
    superieur: string;
    grade: number;
    force: number;
    agilite: number;
    perception: number;
    volonte: number;
    presence: number;
    foi: number;
    pa: number;
    paTotal: number;
    pp: number;
    ppMax: number;
  };

  handleIdentiteChange: (event: any) => any;
  handleFactionChange: (event: any) => void;
  handleSuperieurChange: (event: any) => any;
  handleGradeChange: (event: any) => any;
  handleForceChange: (event: any) => any;
  handleAgiliteChange: (event: any) => any;
  handlePerceptionChange: (event: any) => any;
  handleVolonteChange: (event: any) => any;
  handlePresenceChange: (event: any) => any;
  handleFoiChange: (event: any) => any;

  handlePaChange: (val: number) => void;
  handlePaTotalChange: (val: number) => void;
  handlePpChange: (val: number) => void;
  handlePpMaxChange: (val: number) => void;

  constructor(props: AssistantProps) {
    super(props);
    this.state = {
      identite: "Jean la Mèche",
      faction: FACTIONS.DEMONS,
      superieur: "Baal",
      grade: 3,

      force: 4,
      agilite: 6,
      perception: 5,
      volonte: 7,
      presence: 1.5,
      foi: 5,

      pa: 12,
      paTotal: 9001,
      pp: 60,
      ppMax: 50,

    };

    this.handleIdentiteChange = (event) => this.setState({ identite: event.currentTarget.value });
    this.handleFactionChange = (val) => this.setState({ faction: val, superieur: "" });
    this.handleSuperieurChange = (val) => this.setState({ superieur: val });
    this.handleGradeChange = (val) => this.setState({ grade: val });

    this.handleForceChange = (val) => this.setState({ force: val });
    this.handleAgiliteChange = (val) => this.setState({ agilite: val });
    this.handlePerceptionChange = (val) => this.setState({ perception: val });
    this.handleVolonteChange = (val) => this.setState({ volonte: val });
    this.handlePresenceChange = (val) => this.setState({ presence: val });
    this.handleFoiChange = (val) => this.setState({ foi: val });

    this.handlePaChange = (val) => this.setState({ pa: val });
    this.handlePaTotalChange = (val) => this.setState({ paTotal: val });
    this.handlePpChange = (val) => this.setState({ pp: val });
    this.handlePpMaxChange = (val) => this.setState({ ppMax: val });

    this.handleTalentPrincipalChange = this.handleTalentPrincipalChange.bind(this);

  }

  handleTalentPrincipalChange(talentId: string, oldVal: number, newNewVal: number) {

  }
  handleTalentsPrincipauxPlus(i: any) {
    console.log(i);
  }

  render() {


    let talentsPrincipauxDuPerso = [
      {
        "name": "Défense",
        "level": 8.5
      },
      {
        "name": "Combat",
        "level": 7
      },
      {
        "name": "Combat (crayon très affuté)",
        "level": 9.5
      },
      {
        "name": "Discussion",
        "level": 1
      }
    ];

    let talentsExotiquesDuPerso = [{
      "name": "S'occuper des chiens",
      "level": 2,
      "associatedChara": "Foi",
      "isInnate": false
    }];

    let talentSecondaireDuPerso = [
      {
        "name": "Acrobatie",
        "level": 5.5
      },
      {
        "name": "Athlétisme",
        "level": 6.5
      },
    ];


    let pouvoirsDuPerso = [
      new Pouvoir("Art de Combat", "Mental", "2PP par seconde", 3, "Belial", 4),
      new Pouvoir("Athlétisme", "Physique", "Spécial", 3, null, 3),
      new Pouvoir("Esquive acrobatique", "Physique", "2PP (spécial)", 3, null, 2),
      new Pouvoir("Peur", "Mental", "1PP (activé)", 3, null, 1),
      new Pouvoir("Supériorité martiale", "Physique", "6PP par dix secondes", 4, "15PP minimum", 1),
      new Pouvoir("Régéneration", "Physique", "Permanent", 3, null, 1)
    ];


    return (
      <Stack>
        <Generalites
          identite={this.state.identite} handleIdentiteChange={this.handleIdentiteChange}
          faction={this.state.faction} handleFactionChange={this.handleFactionChange}
          superieur={this.state.superieur} handleSuperieurChange={this.handleSuperieurChange}
          grade={this.state.grade} handleGradeChange={this.handleGradeChange}
        />

        <Caracteristiques
          force={this.state.force} handleForceChange={this.handleForceChange}
          agilite={this.state.agilite} handleAgiliteChange={this.handleAgiliteChange}
          perception={this.state.perception} handlePerceptionChange={this.handlePerceptionChange}
          volonte={this.state.volonte} handleVolonteChange={this.handleVolonteChange}
          presence={this.state.presence} handlePresenceChange={this.handlePresenceChange}
          foi={this.state.foi} handleFoiChange={this.handleFoiChange}

        />

        <Status
          pa={this.state.pa} handlePaChange={this.handlePaChange}
          paTotal={this.state.paTotal} handlePaTotalChange={this.handlePaTotalChange}
          ppMax={this.state.ppMax} handlePpMaxChange={this.handlePpMaxChange}
          pp={this.state.pp} handlePpChange={this.handlePpChange}
          force={this.state.force}
          faction={this.state.faction}

        />

        <Talents
          talentsPrincipauxDuPerso={talentsPrincipauxDuPerso}
          talentsExotiquesDuPerso={talentsExotiquesDuPerso}
          talentsSecondairesDuPerso={talentSecondaireDuPerso} />

        <Pouvoirs pouvoirsDuPerso={pouvoirsDuPerso} />


      </Stack>
    );
  }
}
function App() {

  const identite = "Jean la Mèche";
  const faction = FACTIONS.DEMONS;
  const superieur = "Baal";
  const grade = 3;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Assistant />
    </MantineProvider>
  );
}

export default App;
