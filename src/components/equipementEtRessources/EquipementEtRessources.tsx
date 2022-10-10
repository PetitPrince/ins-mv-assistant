import { useStore } from "../../store/Store";
import { Equipement } from "../../utils/const/Personnage";
import {
  Stack,
  Title,
  Group,
  TextInput,
  Button,
  Table,
  ActionIcon,
  Collapse,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronDown, IconChevronRight, IconTrashX } from "@tabler/icons";
import { useState } from "react";
import slugify from "slugify";

export const EquipementEtRessources = (props: {}) => {
  const currentEquipements = useStore(
    (state) => state.currentPerso.equipements
  );
  const setCurrentEquipement = useStore((state) => state.setCurrentEquipement);
  const deleteCurrentEquipement = useStore(
    (state) => state.deleteCurrentEquipement
  );
  const [newEquipmentPanelOpened, setNewEquipementPanelOpened] = useState(true);
  const iconNewEquipementPanel = newEquipmentPanelOpened ? (
    <IconChevronDown size={12} />
  ) : (
    <IconChevronRight size={12} />
  );
  const form = useForm({
    initialValues: { nom: "", coutEnPa: 0 },
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
        <td>{row.coutEnPa}</td>
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

      <Title order={4} onClick={() => setNewEquipementPanelOpened((o) => !o)}>
        {iconNewEquipementPanel} Nouvel équipement / ressource
      </Title>
      <Collapse in={newEquipmentPanelOpened}>
        <form
          onSubmit={form.onSubmit((values) => {
            const equipmentId = slugify(values.nom, { lower: true });
            const newEquipement = {
              id: equipmentId,
              nom: values.nom,
              coutEnPa: values.coutEnPa,
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
              label="Coût en PA"
              {...form.getInputProps("coutEnPa")}
            />

            <Button type="submit" mt="sm">
              Nouvel équipement / ressource
            </Button>
          </Group>
        </form>{" "}
      </Collapse>
      <Title order={4}></Title>
    </Stack>
  );
};
