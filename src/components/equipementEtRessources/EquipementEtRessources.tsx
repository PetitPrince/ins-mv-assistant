import { useStore } from "../../store/Store";
import { Equipement } from "../../utils/const/Personnage";
import {
  Stack,
  Title,
  Group,
  NumberInput,
  TextInput,
  Button,
  Table,
  Tooltip,
  Indicator,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrashX } from "@tabler/icons";
import slugify from "slugify";

export const EquipementEtRessources = (props: {}) => {
  const currentEquipements = useStore(
    (state) => state.currentPerso.equipements
  );
  const setCurrentEquipement = useStore((state) => state.setCurrentEquipement);
  const deleteCurrentEquipement = useStore(
    (state) => state.deleteCurrentEquipement
  );

  const form = useForm({
    initialValues: { nom: "", coutEnPP: 0 },
  });

  const displayRows = Object.values(currentEquipements).map(
    (row: Equipement) => (
      <tr key={row.id}>
        <td>
          <ActionIcon onClick={() => deleteCurrentEquipement(row.id)}>
            <IconTrashX size={16} />
          </ActionIcon>
        </td>
        <td>{row.nom}</td>
        <td>{row.coutEnPP}</td>
      </tr>
    )
  );

  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Title order={3}>Équipements et ressources</Title>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Nom</th>
            <th>Coût en PA</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>

      <Title order={4}>Nouvel equipement / ressource</Title>
      <form
        onSubmit={form.onSubmit((values) => {
          const equipmentId = slugify(values.nom, { lower: true });
          const newEquipement = {
            id: equipmentId,
            nom: values.nom,
            coutEnPP: values.coutEnPP,
          };
          setCurrentEquipement(equipmentId, newEquipement);
        })}
      >
        {" "}
        <Group>
          <TextInput
            label="Nom"
            placeholder="Nom"
            {...form.getInputProps("nom")}
          />
          <TextInput
            mt="sm"
            label="Coût en PP"
            placeholder='"1/min", "3/utilisation", ... '
            {...form.getInputProps("coutEnPP")}
          />

          <Button type="submit" mt="sm">
            Nouvel equipement / ressource
          </Button>
        </Group>
      </form>
    </Stack>
  );
};
