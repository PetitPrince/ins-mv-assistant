import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Pouvoir } from "../../utils/const/Pouvoir";
import { calcPouvoirLevelFromPaDepense } from "../../utils/helper/getPouvoirLevel";
import { PouvoirLevelCell } from "./PouvoirLevelCell";
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

const PaDepensecell = (props: {
  pa_depense: number;
  id: string;
  faction: FACTIONS_NAMES;
  coutEnPa: number;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
}) => {
  const appmode = useStore((state) => state.appMode);
  const computedLevel = calcPouvoirLevelFromPaDepense(
    props.pa_depense,
    props.coutEnPa
  );
  let errorMsgs = [];
  if (computedLevel < 1) {
    errorMsgs.push("Niveau minimum 1");
  }
  if (
    appmode === APPMODE.CREATE &&
    props.faction === FACTIONS_NAMES.ANGES &&
    computedLevel > 2.5
  ) {
    errorMsgs.push("Niveau maximum à la création pour les anges 2.5");
  }
  if (
    appmode === APPMODE.CREATE &&
    props.faction === FACTIONS_NAMES.DEMONS &&
    computedLevel > 2
  ) {
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
  const appmode = useStore((state) => state.appMode);
  const currentPouvoirs = useStore((state) => state.currentPerso.pouvoirs);
  const faction = useStore((state) => state.currentPerso.faction);
  const setCurrentPouvoirPaDepense = useStore(
    (state) => state.setCurrentPouvoirPaDepense
  );
  const setCurrentPouvoir = useStore((state) => state.setCurrentPouvoir);
  const deleteCurrentPouvoir = useStore((state) => state.deleteCurrentPouvoir);

  const form = useForm({
    initialValues: { nom: "", coutEnPP: "", coutEnPa: 0 },
  });
  const paDepensePouvoirs = Object.values(currentPouvoirs).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );

  let errMsg = "";
  if (
    appmode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.ANGES &&
    (paDepensePouvoirs < 20 || paDepensePouvoirs > 35)
  ) {
    errMsg =
      "Les anges doivent dépenser entre 20 et 35 PA dans les pouvoirs (en moyenne 24).";
  }
  if (
    appmode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.DEMONS &&
    (paDepensePouvoirs < 20 || paDepensePouvoirs > 28)
  ) {
    errMsg =
      "Les démons doivent dépenser entre 20 et 28 PA dans les pouvoirs (en moyenne 24).";
  }

  const isError = errMsg ? true : false;

  const displayRows = Object.values(currentPouvoirs).map((row: Pouvoir) => (
    <tr key={row.id}>
      <td>
        <ActionIcon onClick={() => deleteCurrentPouvoir(row.id)}>
          <IconTrashX size={16} />
        </ActionIcon>
      </td>
      <td>{row.nom}</td>
      <td>
        <PouvoirLevelCell pa_depense={row.pa_depense} coutEnPa={row.coutEnPa} />
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
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={errMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={3}>Pouvoir</Title>
          </Indicator>
        </Tooltip>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Coût en PP</th>
            <th>Coût en PA</th>
            <th>PA depensé</th>
          </tr>
        </thead>
        <tbody>{displayRows}</tbody>
      </Table>

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
          <TextInput
            mt="sm"
            label="Coût en PP"
            placeholder='"1/min", "3/utilisation", ... '
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
