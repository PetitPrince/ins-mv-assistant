import { APPMODE } from "./APPMODE";
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
  Button,
  FileButton,
  Group,
  Header,
  MantineProvider,
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
import slugify from "slugify";

enablePatches();

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}

export const INSMVNumberInput = (props: NumberInputProps) => {
  return <NumberInput {...props} step={0.5} precision={1} />;
};

export const IOPanel = (props: {}) => {
  const originalPerso = useStore((state) => state.originalPerso);
  const setCurrentPerso = useStore((state) => state.setCurrentPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);

  const clickToSave = () => {
    let blob = new Blob([JSON.stringify(originalPerso)], {
      type: "text/json;charset=utf-8",
    });
    saveAs(blob, slugify(originalPerso.identite) + ".json");
  };
  const loadThePerso = (loadedJson: File) => {
    loadedJson.text().then((jsonText) => {
      const parsedJson = JSON.parse(jsonText);
      setCurrentPerso(parsedJson);
      setOriginalPerso(parsedJson);
    });
  };
  return (
    <Group>
      <Button onClick={clickToSave}>
        Exporter personnage (sans modification en cours)
      </Button>
      <FileButton onChange={loadThePerso}>
        {(props) => <Button {...props}>Importer personnage</Button>}
      </FileButton>
    </Group>
  );
};

const FeuilleDePerso = (props: {}) => {
  const setAppMode = useStore((state) => state.setAppMode);

  return (
    <AppShell
      padding="md"
      aside={<BillingPanel />}
      header={
        <Header height={60} p="xs">
          <Group>
            <Title>Assistant INS/MV </Title>
            <SegmentedControl
              onChange={setAppMode}
              data={[
                { label: "Création", value: APPMODE.CREATE },
                { label: "Mise à jour", value: APPMODE.UPDATE },
                { label: "Aventure", value: APPMODE.PLAY },
              ]}
            />
            <IOPanel />
          </Group>
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
        <FeuilleDePerso />
      </NotificationsProvider>
    </MantineProvider>
  );
};
export default App;
