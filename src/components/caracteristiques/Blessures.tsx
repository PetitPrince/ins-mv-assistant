import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Table, Radio, Container } from "@mantine/core";

export const Blessures = (props: {
  force: number;
  faction: FACTIONS_NAMES;
  showMarkers?: boolean;
}) => {
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
    <Container sx={{ marginLeft: 0 }}>
      <Table>
        <thead>
          <tr>
            <th>Gravité</th>
            <th>Seuil</th>
            {props.showMarkers ? <th>Nombre</th> : ""}
          </tr>
        </thead>
        <tbody>
          {rows.map((element) => {
            const markerName = "marker-" + element.name;
            const markers = (
              <Radio.Group name={markerName}>
                <Radio value="0" label="0" />
                <Radio value="1" label="1" />
                <Radio value="2" label="2" />
                <Radio value="3" label="3" />
                <Radio value="4" label="4" />
              </Radio.Group>
            );
            return (
              <tr key={element.name}>
                <td>{element.gravite}</td>
                <td>{element.seuil}</td>
                <td>{markers}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};
