import { APPMODE } from "./APPMODE";
import "./App.css";
import { CreationLimitPanel } from "./components/CreationLimitPanel";
import { BillingPanel } from "./components/billing/Billing";
import { Caracteristiques } from "./components/caracteristiques/Caracteristiques";
import { Generalites } from "./components/generalites/Generalites";
import { LimitSliderThingy } from "./components/limitSliderThingy";
import { PlayPanel } from "./components/playPanel/PlayPanel";
import { TUM } from "./components/playPanel/TUM";
import { Pouvoirs } from "./components/pouvoir/Pouvoirs";
import { Status } from "./components/status/Status";
import { Talents } from "./components/talents/Talents";
import logo from "./logo.png";
import { useStore } from "./store/Store";
import { FACTIONS_NAMES } from "./utils/const/Factions";
import {
  AppShell,
  Aside,
  Button,
  Collapse,
  FileButton,
  Group,
  Header,
  MantineProvider,
  NumberInputProps,
  Space,
  Title,
} from "@mantine/core";
import { NumberInput, Stack, Text, Image } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { IconChevronDown, IconChevronRight } from "@tabler/icons";
import { saveAs } from "file-saver";
import "immer";
import { enablePatches } from "immer";
import { stringify } from "querystring";
import { useState } from "react";
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

const MyAside = (props: {}) => {
  const [creationLimitPanelOpened, setCreationLimitPanelOpened] =
    useState(false);
  const [billingPanelOpened, setBillingPanelOpened] = useState(true);
  const iconCreationLimitPanel = creationLimitPanelOpened ? (
    <IconChevronDown size={12} />
  ) : (
    <IconChevronRight size={12} />
  );
  const iconBillingPanel = billingPanelOpened ? (
    <IconChevronDown size={12} />
  ) : (
    <IconChevronRight size={12} />
  );
  return (
    <Aside width={{ base: 400 }} p="xs">
      <Title order={5} onClick={() => setCreationLimitPanelOpened((o) => !o)}>
        {" "}
        {iconCreationLimitPanel} Limites de crétions
      </Title>
      <Collapse in={creationLimitPanelOpened}>
        <CreationLimitPanel />
      </Collapse>
      <Title order={5} onClick={() => setBillingPanelOpened((o) => !o)}>
        {" "}
        {iconBillingPanel} Modifications
      </Title>
      <Collapse in={billingPanelOpened}>
        <BillingPanel />
      </Collapse>
    </Aside>
  );
};

const FeuilleDePerso = (props: {}) => {
  const appMode = useStore((state) => state.appMode);
  const setAppMode = useStore((state) => state.setAppMode);
  const [tumOpened, setTumOpened] = useState(false);

  let mainPanel;
  let aside;
  if (appMode === APPMODE.PLAY) {
    mainPanel = <PlayPanel />;
  } else {
    mainPanel = (
      <>
        <Generalites />
        <Space h="md" />
        <Caracteristiques />
        <Space h="md" />
        <Status />
        <Space h="md" />
        <Talents />
        <Space h="md" />
        <Pouvoirs />
      </>
    );
    aside = <MyAside />;
  }

  return (
    <AppShell
      padding="md"
      aside={aside}
      header={
        <Header height={60} p="xs">
          <Group>
            <Image src={logo} width={32} height={32} />
            <Title>Assistant INS/MV {tumOpened.valueOf()}</Title>
            <SegmentedControl
              onChange={setAppMode}
              data={[
                { label: "Création", value: APPMODE.CREATE },
                { label: "Mise à jour", value: APPMODE.UPDATE },
                { label: "Aventure", value: APPMODE.PLAY },
              ]}
            />
            <IOPanel />
            <Button onClick={() => setTumOpened((o) => !o)}>TUM</Button>
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
      <TUM opened={tumOpened} />
      {mainPanel}
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
