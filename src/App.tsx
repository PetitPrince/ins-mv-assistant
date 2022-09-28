import "./App.css";
import { BillingPanel } from "./components/billing/Billing";
import { Caracteristiques } from "./components/caracteristiques/Caracteristiques";
import { Generalites } from "./components/generalites/Generalites";
import { Pouvoirs } from "./components/pouvoir/Pouvoirs";
import { Status } from "./components/status/Status";
import { Talents } from "./components/talents/Talents";
import { useStore } from "./store/Store";
import { FACTIONS_NAMES } from "./utils/const/Factions";
import { MantineProvider, NumberInputProps } from "@mantine/core";
import { NumberInput, Stack } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "immer";
import { enablePatches } from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";

enablePatches();

const unPerso = {
  identite: "Jean la Mèche",
  faction: FACTIONS_NAMES.DEMONS,
  superieur: "Baal",
  grade: 3,

  caracteristiques: {
    force: 4,
    agilite: 6,
    perception: 5,
    volonte: 7,
    presence: 1.5,
    foi: 5,
  },
  pa: 12,
  paTotal: 9001,
  pp: 60,
  ppMax: 50, // max PP is governed by faith + bought PP; not sure if it's the best to store it raw like this
};

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}

export const INSMVNumberInput = (props: NumberInputProps) => {
  return <NumberInput {...props} step={0.5} precision={1} />;
};

const FeuilleDePerso = (props: {}) => {
  return (
    <Stack>
      <BillingPanel />

      <Generalites />

      <Caracteristiques />
      <Status />
      <Talents />
      <Pouvoirs />
    </Stack>
  );
};

const App = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <SegmentedControl
          data={[
            { label: "Creation", value: "create" },
            { label: "Update", value: "update" },
          ]}
        />
        <FeuilleDePerso />
      </NotificationsProvider>
    </MantineProvider>
  );
};
export default App;
