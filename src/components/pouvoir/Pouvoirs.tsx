import { useStore } from "../../store/Store";
import { Pouvoir, PouvoirCollection } from "../../utils/const/Pouvoir";
import { getPouvoirLevel } from "../../utils/helper/getPouvoirLevel";
import {
  Stack,
  Title,
  Text,
  Group,
  NumberInput,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import slugify from "slugify";

export const Pouvoirs = (props: {}) => {
  const currentPerso = useStore((state) => state.currentPerso);
  const setCurrentPouvoirPaDepense = useStore(
    (state) => state.setCurrentPouvoirPaDepense
  );
  const setCurrentPouvoir = useStore((state) => state.setCurrentPouvoir);

  const form = useForm({
    initialValues: { nom: "", coutEnPP: 0, coutEnPa: 0 },
  });

  let currentPouvoirs: PouvoirCollection = currentPerso.pouvoirs;

  const levelRenderer = (record: Pouvoir) => {
    const computedLevel = getPouvoirLevel(currentPerso, record.id);
    return <Text>{computedLevel}</Text>;
  };
  const paRenderer = (record: Pouvoir) => {
    return (
      <Group>
        <NumberInput
          value={record.pa_depense}
          onChange={(val: number) => {
            setCurrentPouvoirPaDepense(record.id, val);
          }}
        />
      </Group>
    );
  };
  return (
    <Stack>
      <Title order={3}>Pouvoirs</Title>
      <DataTable
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
      />
      <Title order={4}>Nouveau pouvoir</Title>
      <form
        onSubmit={form.onSubmit((values) => {
          const pouvoirId = slugify(values.nom);
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
