import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Table, Radio } from "@mantine/core";

export const Blessures = (props: { force: number; faction: FACTIONS_NAMES }) => {
  const force = props.force;

  let modificateur_faction;
  switch (props.faction) {
    case FACTIONS_NAMES.ANGES:
      modificateur_faction = 3;
      break;
    case FACTIONS_NAMES.DEMONS:
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
