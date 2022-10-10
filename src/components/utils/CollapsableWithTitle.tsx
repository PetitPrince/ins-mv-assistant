import { Title, Collapse, useMantineTheme } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons";
import { useState } from "react";

export const CollapsableWithTitle = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  const [collapsableOpened, setCollapsableOpened] = useState(true);
  const iconNewEquipementPanel = collapsableOpened ? (
    <IconChevronDown size={12} />
  ) : (
    <IconChevronRight size={12} />
  );

  return (
    <>
      <Title order={5} onClick={() => setCollapsableOpened((o) => !o)}>
        {iconNewEquipementPanel} {props.title}
      </Title>
      <Collapse in={collapsableOpened}>{props.children}</Collapse>
    </>
  );
};
