import { NumberInput, Stack, Group, Title, Table, Radio } from '@mantine/core';
import { Factions } from './myConst';
import { IFeuilleDePersoState } from './App'
import { useSetState } from '@mantine/hooks';

export function Blessures(props: { force: number; faction: Factions; }) {
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

export interface StatusProps {
    pa: number,
    paTotal: number,
    pp: number,
    ppMax: number,
    force: number,
    faction: Factions,

    statusChangeHandler: (updatedState: Partial<IFeuilleDePersoState>) => void

}

export function Status(props: StatusProps) {
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