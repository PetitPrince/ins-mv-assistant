import { ActionIcon, Button, Grid, NumberInput, Popover, TextInput, Title } from '@mantine/core';
import { Stack, Group, Table } from '@mantine/core';
import { Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import slugify from 'slugify';
import { getCaracteristiqueLevel, getTalentLevel, Personnage, useStore } from './Store';
import { TalentStandard, TalentsCollection, TCaracteristiquesSet, TalentExistant, TALENTS_PRINCIPAUX_STANDARD, TALENTS_SECONDAIRES_STANDARD, INSMVNumberInput, ICaracteristiquesSet, ICaracteristiquesSet2 } from './App';
import { paToCarac } from './Caracteristiques';
import { PropsOf } from '@emotion/react';

interface TalentDisplayRow extends TalentStandard {
  level: number | undefined;
  pa_depense: number;
}
function computeRowsTalents(characterTalents: TalentsCollection, currentPerso: Personnage, talentsStandards: TalentStandard[]) {
  let rows: TalentDisplayRow[] = [];

  // Go through the list of standard talents, display those who are presents
  for (const standardTalent of talentsStandards) {
    const { name, id, associatedChara, isInnate, specialisationType } = standardTalent;
    // TODO: cleanup
    switch (specialisationType) {
      case "Multiple":
        // I need look for hobby, but also hobby-dressage-de-bouquetin
        // from a list of key(talent-id), determine if one begins with a string
        const existingTalentsStartingWithId = Object.entries(characterTalents).filter(([k, v]) => k.startsWith(id));

        for (const [existingTalentId, existingTalent] of existingTalentsStartingWithId) {
          rows.push({
            ...standardTalent,
            id: existingTalentId,
            name: standardTalent.name + " (" + existingTalent.customNameFragment + ")",
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense
          });
        }
        rows.push({
          ...standardTalent,
          name: standardTalent.name + "...",
          level: undefined,
          pa_depense: 0
        });
        // iterate over all of them
        break;
      case "Spécifique":
        const isNameEditable = id.includes("specifique");

        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          const displayName = existingTalent.customNameFragment ? name + " (" + existingTalent.customNameFragment + ")" : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense
          });

        } else {
          const defaultLevel = isInnate ? getCaracteristiqueLevel(currentPerso, associatedChara) : undefined;
          const displayName = isNameEditable ? name + "(...)" : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: defaultLevel,
            pa_depense: 0

          });
        }
        break;
      case "Générique":
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          rows.push({
            ...standardTalent,
            level: existingTalent.niveau,
            pa_depense: existingTalent.pa_depense

          });
        } else {
          const defaultLevel = isInnate ? getCaracteristiqueLevel(currentPerso, associatedChara) : undefined;
          rows.push({
            ...standardTalent,
            level: defaultLevel,
            pa_depense: 0

          });
        }
        break;
    }
  }
  return rows;
}


function TalentRow(props: { row: TalentDisplayRow, tpool: string }) {
  const row = props.row;
  const tpool = props.tpool
  const perso = useStore((state) => state.currentPerso);
  const talentPool = perso.talents.principaux;

  const setCurrentTalentPrincipalPaDepense = useStore((state) => state.setCurrentTalentPrincipalPaDepense);
  const niveau = getTalentLevel(perso, row.id);

  const setCurrentTalent = (id: string, val: number | undefined, newCustomNameFragment?: string) => {
    if (val != undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      setCurrentTalentPrincipalPaDepense(id, val);

    }
  }

  return (
    <tr key={row.id}>
      <td>{row.name}</td>
      <td>
        <INSMVNumberInput value={niveau} hideControls readOnly variant="unstyled" />
        <NumberInput value={row.pa_depense} onChange={(val: number) => { setCurrentTalent(row.id, val); }} />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
}

function TalentRowSpecifique(props: { row: TalentDisplayRow, tpool : string }) {
  const row = props.row;
  const talentId = row.id;
  const primaryTalentId = talentId.split("-specifique")[0];

  const setCurrentTalentPrincipalPaDepense = useStore((state) => state.setCurrentTalentPrincipalPaDepense);
  const setCurrentTalentPrincipalNameFragment = useStore((state) => state.setCurrentTalentPrincipalNameFragment);

  const setCurrentTalentSecondairePaDepense = useStore((state) => state.setCurrentTalentSecondairePaDepense);
  const setCurrentTalentSecondaireNameFragment = useStore((state) => state.setCurrentTalentSecondaireNameFragment);

  const currentPerso = useStore((state) => state.currentPerso);
  const tpool = props.tpool;
  let talentPool : TalentsCollection;
  if(tpool==="principaux"){
    talentPool = currentPerso.talents.principaux;
  }else{ // assume secondaire
    talentPool = currentPerso.talents.secondaires;

  }

  // check if the primary talent has a higher level than the specialized one; output a warning if it's the case
  let primaryTalentLevel;
  if (Object.hasOwn(talentPool, primaryTalentId)) { // does the primary talent is defined ?
    primaryTalentLevel = getTalentLevel(currentPerso, primaryTalentId);
  } else { // otherwise set level to 0
    primaryTalentLevel = 0;
  }

  const specificTalentLevel = getTalentLevel(currentPerso, talentId);
  let errorString;
  if (primaryTalentLevel > specificTalentLevel) {
    errorString = "Le niveau du talent général ne peut pas dépasser la spécialité";
  }

  const niveau = getTalentLevel(currentPerso, talentId);

  const setCurrentTalent = (id: string, val: number | undefined, newCustomNameFragment?: string) => {
    if (val != undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      if(tpool==="Principal"){
        setCurrentTalentPrincipalPaDepense(id, val);
      }{
        setCurrentTalentSecondairePaDepense(id,val);
      }
    }
  };

  const setCurrentTalentNameFragment = (talentId:string, val:string)=>{
    if(tpool==="Principal"){
      setCurrentTalentPrincipalNameFragment(talentId, val);
    }else{
      setCurrentTalentSecondaireNameFragment(talentId,val);
    }
  }

  return (
    <tr key={row.id}>
      <td>{row.name} {errorString}
        <Popover width={300} trapFocus position="bottom" shadow="md">
          <Popover.Target>
            <ActionIcon><IconEdit size={16} /></ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={(event: any) => { let talentNameFragment = event.target.talentNameFragment.value; setCurrentTalentNameFragment(row.id, talentNameFragment); event.preventDefault(); }}
            >
              <TextInput label="Nom de la spécialisation" name="talentNameFragment" size="xs" />
              <Button type="submit">Changer</Button>
            </form>
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>
        <INSMVNumberInput error={errorString} value={niveau} hideControls readOnly variant="unstyled" />
        <NumberInput value={row.pa_depense} onChange={(val: number) => { setCurrentTalent(row.id, val); }} />
      </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
}


function TalentRowMultiple(props: { row: TalentDisplayRow, tpool: string }) {
  const row = props.row;
  const talentId = row.id;
  const tpool =props.tpool;
  let talentPool : TalentsCollection;
  const currentPerso = useStore((state) => state.currentPerso);
  const storeCurrentTalentSecondaire = useStore(state => state.setCurrentTalentSecondaire);
  const storeCurrentTalentPrincipal = useStore(state => state.setCurrentTalentPrincipal);

  if(tpool==="Principal"){
    talentPool = currentPerso.talents.principaux;
  }else{ // assume secondaire
    talentPool = currentPerso.talents.secondaires;

  }

  const setCurrentTalent = (id: string, val: number | undefined, newCustomNameFragment?: string) => {
    if (val != undefined) {
      let updatedCustomNameFragment;
      if (Object.hasOwn(talentPool, id) && talentPool[id].customNameFragment) {
        updatedCustomNameFragment = talentPool[id].customNameFragment;
      }
      if (newCustomNameFragment) {
        updatedCustomNameFragment = newCustomNameFragment;
      }
      const newTal: TalentExistant = updatedCustomNameFragment ? {
        customNameFragment: updatedCustomNameFragment,
        niveau: 0, // todo: this is useless
        pa_depense: val
      } : {
        niveau: 0,// todo: this is useless
        pa_depense: val
      };
      if(tpool==="Principal"){
        storeCurrentTalentPrincipal(id, newTal);
      }{
        storeCurrentTalentSecondaire(id,newTal);
      }
    }
  };
  if (row.level == undefined) {
    return (
      <tr key={row.id}>
        <td>{row.name}
        </td>
        <td>
          <Text>Nom du talent</Text>
          <Group mt="xs" spacing="xs">
            <form
              onSubmit={(event: any) => {
                let talentNameFragment = event.target.talentNameFragment.value;
                let newTalentFragmentName = row.id + "_" + slugify(talentNameFragment, { lower: true });
                setCurrentTalent(newTalentFragmentName, 0, talentNameFragment);
                event.preventDefault();
              }}
            >
              <TextInput name="talentNameFragment" size="xs" />
              <Button size="xs" type='submit'
              >Ajouter</Button>
            </form>
          </Group>
        </td>
        <td>{row.associatedChara}</td>
      </tr>
    );
  }
  const justTheParens = row.name.match(/\([^\)]*\)/);
  const parensContent = justTheParens ? justTheParens[0].slice(1, justTheParens[0].length - 1) : undefined;
  const niveau = getTalentLevel(currentPerso, talentId);

  return (
    <tr key={row.id}>
      <td>{row.name}
      </td>
      <td>
      <INSMVNumberInput value={niveau} hideControls readOnly variant="unstyled" />
        <NumberInput value={row.pa_depense} onChange={(val: number) => { setCurrentTalent(row.id, val, parensContent); }} />

        </td>
      <td>{row.associatedChara}</td>
    </tr>
  );
}

function TalentsGenerique(props: { standardTalentPool: TalentStandard[], title: string, tpool:string }) {
  const standardTalentPool = props.standardTalentPool;
  const title = props.title;
  const tpool = props.tpool;
  const characterTalentsPrincipaux = useStore((state) => state.currentPerso.talents.principaux);
  const characterTalentsSecondaire = useStore((state) => state.currentPerso.talents.secondaires);

  let characterTalents;

  if(tpool==="Principal"){
    characterTalents = characterTalentsPrincipaux;
  }else{
    characterTalents = characterTalentsSecondaire;
  }
  const currentPerso = useStore((state) => state.currentPerso);


  const rows = computeRowsTalents(characterTalents, currentPerso, standardTalentPool);

  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Carac</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: TalentDisplayRow) => {
            switch (row.specialisationType) {
              case "Spécifique":
                const primaryTalentId = row.id.split("-specifique")[0];
                const isPrimary = primaryTalentId === row.id;
                if (!isPrimary) {
                  return (<TalentRowSpecifique row={row} key={row.id} tpool={tpool} />);
                } else {
                  return (<TalentRow row={row} key={row.id} tpool={tpool}/>);
                }
                break;
              case "Multiple":
                console.log("mutiple: "+row.id)
                return(<TalentRowMultiple row={row} key={row.id} tpool={tpool} />)
                break;
              default:
                return (<TalentRow row={row} key={row.id} tpool={tpool} />);
            }
          })}
        </tbody>
      </Table>
    </Stack>
  );
}


/* --------------------------------------------- */

export function Talents(props: {}) {
  return (
    <Stack>
      <Title order={2}>Talents</Title>
      <Grid>
        <Grid.Col span={4}>
          <TalentsGenerique title="Talents principaux" standardTalentPool={TALENTS_PRINCIPAUX_STANDARD} tpool="Principal" />
        </Grid.Col>
        {/* <Grid.Col span={4}>
              <TalentsExotiques talentsExotiquesDuPerso={props.talentsExotiquesDuPerso} />
            </Grid.Col>*/}
        <Grid.Col span={4}>
          <TalentsGenerique title="Talents secondaires" standardTalentPool={TALENTS_SECONDAIRES_STANDARD} tpool="Secondaire"
          />
        </Grid.Col>
      </Grid>
    </Stack>

  );
}
