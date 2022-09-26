import { NumberInput, Stack, Group, Title, Table, Radio } from "@mantine/core";
import { getCaracteristiqueLevel, useStore } from "./Store";
import { FACTIONS } from "./myConst";

export const Blessures = (props: { force: number; faction: FACTIONS }) => {
  const force = props.force;

  let modificateur_faction;
  switch (props.faction) {
    case FACTIONS.ANGES:
      modificateur_faction = 3;
      break;
    case FACTIONS.DEMONS:
      modificateur_faction = 2;
      break;
    default:
      modificateur_faction = 0;
      break;
  }

  let seuil_blessure_legere = modificateur_faction + Math.floor(force);
  let seuil_blessure_grave = 2 * seuil_blessure_legere;
  let seuil_blessure_fatale = 3 * seuil_blessure_legere;
  let seuil_mort_subite = 4 * seuil_blessure_legere;

  const rows = [
    { name: "bl", gravite: "Blessure légère", seuil: seuil_blessure_legere },
    { name: "bg", gravite: "Blessure grave", seuil: seuil_blessure_grave },
    { name: "bf", gravite: "Blessure fatale", seuil: seuil_blessure_fatale },
    { name: "ms", gravite: "Mort subite", seuil: seuil_mort_subite },
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
        {rows.map((element) => (
          <tr key={element.name}>
            <td>{element.gravite}</td>
            <td>{element.seuil}</td>
            <td>
              <Radio.Group name={element.name} defaultValue="0">
                <Radio label="0" value="0" />
                <Radio label="1" value="1" />
                <Radio label="2" value="2" />
                <Radio label="3" value="3" />
                <Radio label="4" value="4" />
              </Radio.Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export const Status = (props: {}) => {
  const pa = useStore((state) => state.currentPerso.pa);
  const currentPerso = useStore((state) => state.currentPerso);
  const faction = useStore((state) => state.currentPerso.faction);
  const ppMax = useStore((state) => state.currentPerso.ppMax);
  const force = getCaracteristiqueLevel(currentPerso, "force");
  const setCurrentPa = useStore((state) => state.setCurrentPa);

  // const storePaTotal = useStore(state => state.setDraftPaTotal)
  // const storePp = useStore(state => state.setDraftPp)
  const storePpMax = useStore((state) => state.setCurrentPpMax);
  const setPpMax = (val: number) => storePpMax(val);

  return (
    <Stack>
      <Title order={2}>Status</Title>
      <Group>
        <NumberInput
          label="Point d'Administration (PA) restant"
          value={pa}
          onChange={(val: number) => {
            setCurrentPa(val);
          }}
        />
        {/* <NumberInput label="PA accumulés" value={paTotal}/> */}
        {/* <NumberInput label="Point de Pouvoir (PP)" value={props.pp}
                    onChange={(val: number) => { setPp(val) }}/> */}
        <NumberInput
          label="PP Maximum"
          value={ppMax}
          onChange={(val: number) => {
            setPpMax(val);
          }}
        />
        <Blessures force={force} faction={faction} />
      </Group>
    </Stack>
  );
};
