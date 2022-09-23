import { ActionIcon, Button, Grid, Popover, TextInput, Title } from '@mantine/core';
import { Stack, Group, Table } from '@mantine/core';
import { Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons';
import slugify from 'slugify';
import { useStore } from './Store';
import { TalentStandard, TalentsCollection, TCaracteristiquesSet, TalentExistant, TALENTS_PRINCIPAUX_STANDARD, TALENTS_SECONDAIRES_STANDARD, INSMVNumberInput, ICaracteristiquesSet, ICaracteristiquesSet2 } from './App';

interface TalentDisplayRow extends TalentStandard {
  level: number | undefined;
}
function computeRowsTalents(characterTalents: TalentsCollection, characterCara: ICaracteristiquesSet2, talentsStandards: TalentStandard[]) {
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
            level: existingTalent.niveau
          });
        }
        rows.push({
          ...standardTalent,
          name: standardTalent.name + "...",
          level: undefined
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
            level: existingTalent.niveau
          });

        } else {
          const defaultLevel = isInnate ? Math.floor(characterCara[associatedChara].niveau / 2) : undefined;
          const displayName = isNameEditable ? name + "(...)" : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: defaultLevel
          });
        }
        break;
      case "Générique":
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          rows.push({
            ...standardTalent,
            level: existingTalent.niveau
          });
        } else {
          const defaultLevel = isInnate ? Math.floor(characterCara[associatedChara].niveau / 2) : undefined;
          rows.push({
            ...standardTalent,
            level: defaultLevel
          });
        }
        break;
    }
  }
  return rows;
}
function TalentsPrincipaux(props: { characterTalents: TalentsCollection; }) {
  const storeCurrentTalent = useStore(state => state.setCurrentTalentPrincipal);

  return (<TalentsGenerique characterTalents={props.characterTalents}
    talentCategory="principal"
    storeCurrentTalent={storeCurrentTalent} />);

}
function TalentsSecondaires(props: { characterTalents: TalentsCollection; }) {
  const storeCurrentTalent = useStore(state => state.setCurrentTalentSecondaire);

  return (<TalentsGenerique characterTalents={props.characterTalents}
    talentCategory="secondaire"
    storeCurrentTalent={storeCurrentTalent} />);

}
function TalentsGenerique(props: {
  characterTalents: TalentsCollection;
  talentCategory: "principal" | "secondaire";
  storeCurrentTalent: (talentId: string, val: TalentExistant) => void;
}) {
  const perso = useStore((state) => state.currentPerso);
  const originalPerso = useStore((state) => state.originalPerso);
  const storeCurrentTalent = props.storeCurrentTalent;
  let talentPool: TalentsCollection;
  let originalTalentPool: TalentsCollection;
  let standardTalentPool: TalentStandard[];
  let title;
  if (props.talentCategory === "principal") {
    talentPool = perso.talents.principaux;
    originalTalentPool = originalPerso.talents.principaux;
    standardTalentPool = TALENTS_PRINCIPAUX_STANDARD;
    title = "Talents principaux";
  }

  // else if(props.talentCategory==="secondaire"){}
  else {
    talentPool = perso.talents.secondaires;
    originalTalentPool = originalPerso.talents.secondaires;
    standardTalentPool = TALENTS_SECONDAIRES_STANDARD;
    title = "Talents secondaires";
  }

  const rows = computeRowsTalents(props.characterTalents, perso.caracteristiques, standardTalentPool);

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
        niveau: val,
        customNameFragment: updatedCustomNameFragment
      } : {
        niveau: val,
      };
      storeCurrentTalent(id, newTal);
    }
  };


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
        <tbody>{rows.map((row: TalentDisplayRow) => {
          let isModified = false;
          if (Object.hasOwn(originalTalentPool, row.id)) {
            isModified = row.level !== originalTalentPool[row.id].niveau;
          } else {
            isModified = (row.level || 0) > 1;
          }
          const availablePa = perso.pa;
          const variant = isModified ? "filled" : "default";
          const radius = isModified ? "xl" : "sm";
          let errorString = isModified && availablePa < 0 ? "  " : "";

          if (row.specialisationType === "Spécifique") {
            const primaryTalentId = row.id.split("-specifique")[0];
            const isPrimary = primaryTalentId === row.id;
            const primaryTalent = perso.talents.secondaires[primaryTalentId];
            if (primaryTalent && row.level) {
              if (primaryTalent.niveau > row.level) {
                errorString = "Le niveau du talent général ne peut pas dépasser la spécialité";
              }
            }
            let specificTalentFragment;
            if (!isPrimary) {
              specificTalentFragment = (<Popover width={300} trapFocus position="bottom" shadow="md">
                <Popover.Target>
                  <ActionIcon><IconEdit size={16} /></ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <form
                    onSubmit={(event: any) => { let talentNameFragment = event.target.talentNameFragment.value; setCurrentTalent(row.id, rowLevel, talentNameFragment); }}
                  >
                    <TextInput label="Nom de la spécialisation" name="talentNameFragment" size="xs" />
                    <Button type="submit">Changer</Button>
                  </form>
                </Popover.Dropdown>
              </Popover>
              );
            }
            const rowLevel = row.level ? row.level : 1;

            return (
              <tr key={row.id}>
                <td>{row.name} {specificTalentFragment}
                </td>
                <td><INSMVNumberInput error={errorString} variant={variant} radius={radius} value={row.level} min={1} onChange={(val: number) => { setCurrentTalent(row.id, val); }} /></td>
                <td>{row.associatedChara}</td>
              </tr>
            );
          } else if (row.specialisationType === "Multiple") {
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
                          let newTalentFragmentName = row.id + "-" + slugify(talentNameFragment, { lower: true });
                          setCurrentTalent(newTalentFragmentName, 1, talentNameFragment);
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
            return (
              <tr key={row.id}>
                <td>{row.name}
                </td>
                <td><INSMVNumberInput error={errorString} variant={variant} radius={radius} value={row.level} min={1} onChange={(val: number) => { setCurrentTalent(row.id, val, parensContent); }} /></td>
                <td>{row.associatedChara}</td>
              </tr>
            );
          }
          else {
            return (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td><INSMVNumberInput error={errorString} variant={variant} radius={radius} value={row.level} min={1} onChange={(val: number) => { setCurrentTalent(row.id, val); }} /></td>
                <td>{row.associatedChara}</td>
              </tr>
            );
          }
        }
        )}</tbody>
      </Table>
    </Stack>
  );
}
export function Talents(props: {
  talents: {
    principaux: TalentsCollection;
    secondaires: TalentsCollection;
    exotiques: TalentsCollection;

  };
}) {

  return (
    <Stack>
      <Title order={2}>Talents</Title>
      <Grid>
        <Grid.Col span={4}>
          <TalentsPrincipaux characterTalents={props.talents.principaux} />
        </Grid.Col>
        {/* <Grid.Col span={4}>
              <TalentsExotiques talentsExotiquesDuPerso={props.talentsExotiquesDuPerso} />
            </Grid.Col>*/}
        <Grid.Col span={4}>
          <TalentsSecondaires
            characterTalents={props.talents.secondaires} />
        </Grid.Col>
      </Grid>
    </Stack>

  );
}
