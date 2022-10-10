import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import {
  SUPERIEURS_ANGES_AUTOCOMPLETE,
  SUPERIEURS_DEMONS_AUTOCOMPLETE,
} from "../../utils/const/Superieurs";
import { Autocomplete, AutocompleteItem } from "@mantine/core";

export const Superieur = (props: {}) => {
  const value = useStore((state) => state.currentPerso.superieur);
  const faction = useStore((state) => state.currentPerso.faction);

  const setCurrentSuperieur = useStore((state) => state.setCurrentSuperieur);
  let superieurs;
  switch (faction) {
    case FACTIONS_NAMES.ANGES:
      superieurs = SUPERIEURS_ANGES_AUTOCOMPLETE;
      break;
    case FACTIONS_NAMES.DEMONS:
      superieurs = SUPERIEURS_DEMONS_AUTOCOMPLETE;
      break;
    default:
      superieurs = [""];
      break;
  }

  return (
    <Autocomplete
      data={superieurs}
      label="Supérieur"
      limit={1000}
      defaultValue={value}
      // onChange={(val: string) => setCurrentSuperieur(val)}
      onItemSubmit={(val: AutocompleteItem) => setCurrentSuperieur(val.value)}
    />
  );
};
