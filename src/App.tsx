import "./App.css";
import { BillingPanel } from "./components/billing/Billing";
import { Caracteristiques } from "./components/caracteristiques/Caracteristiques";
import { Generalites } from "./components/generalites/Generalites";
import { Pouvoirs } from "./components/pouvoir/Pouvoirs";
import { Status } from "./components/status/Status";
import { Talents } from "./components/talents/Talents";
import { useStore } from "./store/Store";
import { FACTIONS_NAMES } from "./utils/const/Factions";
import {
  AppShell,
  Aside,
  Button,
  FileButton,
  Group,
  Header,
  MantineProvider,
  Navbar,
  NumberInputProps,
  Title,
} from "@mantine/core";
import { NumberInput, Stack } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { saveAs } from "file-saver";
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

export const IOPanel = (props: {}) => {
  const currentPerso = useStore((state) => state.currentPerso);
  const setCurrentPerso = useStore((state) => state.setCurrentPerso);

  const clickToSave = () => {
    let blob = new Blob([JSON.stringify(currentPerso)], {
      type: "text/json;charset=utf-8",
    });
    saveAs(blob, "perso.json");
  };
  const loadThePerso = (foo: File) => {
    foo.text().then((fooText) => {
      setCurrentPerso(JSON.parse(fooText));
    });
  };
  return (
    <Group>
      <Button onClick={clickToSave}>Exporter brouillon</Button>
      <FileButton onChange={loadThePerso}>
        {(props) => <Button {...props}>Importer brouillon</Button>}
      </FileButton>
    </Group>
  );
};

const FeuilleDePerso = (props: {}) => {
  return (
    <AppShell
      padding="md"
      aside={<BillingPanel />}
      header={
        <Header height={60} p="xs">
          <Title>INS/MV Assistant</Title>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Stack>
        <IOPanel />

        <Generalites />

        <Caracteristiques />
        <Status />
        <Talents />
        <Pouvoirs />
      </Stack>
    </AppShell>
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
