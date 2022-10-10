import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Pouvoir } from "../../utils/const/Pouvoir";
import { CollapsableWithTitle } from "../utils/CollapsableWithTitle";
import { PouvoirRow } from "./pouvoirRow/PouvoirRow";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import slugify from "slugify";

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
  const sumPaDepensePouvoirs = Object.values(currentPouvoirs).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );

  let errMsg = "";
  if (
    appmode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.ANGES &&
    (sumPaDepensePouvoirs < 20 || sumPaDepensePouvoirs > 35)
  ) {
    errMsg =
      "Les anges doivent dépenser entre 20 et 35 PA dans les pouvoirs (en moyenne 24).";
  }
  if (
    appmode === APPMODE.CREATE &&
    faction === FACTIONS_NAMES.DEMONS &&
    (sumPaDepensePouvoirs < 20 || sumPaDepensePouvoirs > 28)
  ) {
    errMsg =
      "Les démons doivent dépenser entre 20 et 28 PA dans les pouvoirs (en moyenne 24).";
  }

  const isError = errMsg ? true : false;

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
        <tbody>
          {Object.values(currentPouvoirs).map((row: Pouvoir) => (
            <PouvoirRow
              row={row}
              faction={faction}
              deleteCurrentPouvoir={deleteCurrentPouvoir}
              setCurrentPouvoirPaDepense={setCurrentPouvoirPaDepense}
            />
          ))}
        </tbody>
      </Table>

      <CollapsableWithTitle title="Nouveau pouvoir">
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
          <Group align="end">
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
              Ajouter
            </Button>
          </Group>
        </form>
      </CollapsableWithTitle>
    </Stack>
  );
};
