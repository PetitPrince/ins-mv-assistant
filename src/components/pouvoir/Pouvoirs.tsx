import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Pouvoir } from "../../utils/const/Pouvoir";
import { calcPouvoirLevelFromPaDepense } from "../../utils/helper/getPouvoirLevel";
import {
  Stack,
  Title,
  Text,
  Group,
  NumberInput,
  TextInput,
  Button,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import slugify from "slugify";

const LevelCell = (props: { pa_depense: number; coutEnPa: number }) => {
  const computedLevel = calcPouvoirLevelFromPaDepense(
    props.pa_depense,
    props.coutEnPa
  );
  return <Text>{computedLevel}</Text>;
};

const PaDepensecell = (props: {
  pa_depense: number;
  id: string;
  faction: FACTIONS_NAMES;
  coutEnPa: number;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
}) => {
  const computedLevel = calcPouvoirLevelFromPaDepense(
    props.pa_depense,
    props.coutEnPa
  );
  let errorMsgs = [];
  if (computedLevel < 1) {
    errorMsgs.push("Niveau minimum 1");
  }
  if (props.faction === FACTIONS_NAMES.ANGES && computedLevel > 2.5) {
    errorMsgs.push("Niveau maximum à la création pour les anges 2.5");
  }
  if (props.faction === FACTIONS_NAMES.DEMONS && computedLevel > 2) {
    errorMsgs.push("Niveau maximum à la création pour les démons 2");
  }
  const errorMsg = errorMsgs.join(" + ");

  return (
    <Group>
      <NumberInput
        value={props.pa_depense}
        onChange={(val: number) => {
          props.setCurrentPouvoirPaDepense(props.id, val);
        }}
        error={errorMsg}
      />
    </Group>
  );
};

export const Pouvoirs = (props: {}) => {
  const currentPouvoirs = useStore((state) => state.currentPerso.pouvoirs);
  const faction = useStore((state) => state.currentPerso.faction);
  const setCurrentPouvoirPaDepense = useStore(
    (state) => state.setCurrentPouvoirPaDepense
  );
  const setCurrentPouvoir = useStore((state) => state.setCurrentPouvoir);

  const form = useForm({
    initialValues: { nom: "", coutEnPP: 0, coutEnPa: 0 },
  });

  const displayRows = Object.values(currentPouvoirs).map((row: Pouvoir) => (
    <tr key={row.id}>
      <td>{row.nom}</td>
      <td>
        <LevelCell pa_depense={row.pa_depense} coutEnPa={row.coutEnPa} />
      </td>
      <td>{row.coutEnPP}</td>
      <td>{row.coutEnPa}</td>
      <td>
        <PaDepensecell
          pa_depense={row.pa_depense}
          id={row.id}
          setCurrentPouvoirPaDepense={setCurrentPouvoirPaDepense}
          faction={faction}
          coutEnPa={row.coutEnPa}
        />
      </td>
    </tr>
  ));

  return (
    <Stack>
      <Title order={3}>Pouvoirs</Title>
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Coût en PP</th>
            <th>Coût en PA</th>
            <th>PA depensé</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>
      {/* <DataTable
        columns={[
          { title: "Nom", accessor: "nom" },
          {
            title: "Niveau",
            accessor: "noaccessor",
            render: levelRenderer,
          },
          { title: "Coût en PP", accessor: "id" },
          { title: "Coût en PP", accessor: "coutEnPP" },
          { title: "Coût en PA", accessor: "coutEnPa" },
          {
            title: "PA dépensé",
            accessor: "pa_depense",
            render: paRenderer,
          },
        ]}
        records={Object.values(currentPouvoirs)}
      /> */}
      <Title order={4}>Nouveau pouvoir</Title>
      <form
        onSubmit={form.onSubmit((values) => {
          const pouvoirId = slugify(values.nom, { lower: true });
          const newPouvoir = {
            id: pouvoirId,
            nom: values.nom,
            coutEnPP: values.coutEnPP,
            coutEnPa: values.coutEnPa,
            pa_depense: 0,
          };
          setCurrentPouvoir(pouvoirId, newPouvoir);
        })}
      >
        {" "}
        <Group>
          <TextInput
            label="Nom"
            placeholder="Nom"
            {...form.getInputProps("nom")}
          />
          <NumberInput
            mt="sm"
            label="Coût en PP"
            placeholder="Coût en PP"
            {...form.getInputProps("coutEnPP")}
          />
          <NumberInput
            mt="sm"
            label="Coût en PA"
            placeholder="Coût en PA"
            {...form.getInputProps("coutEnPa")}
          />
          <Button type="submit" mt="sm">
            Nouveau pouvoir
          </Button>
        </Group>
      </form>
    </Stack>
  );
};
