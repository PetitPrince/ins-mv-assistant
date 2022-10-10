import { BillingItem } from "./Billing";
import { BillingActionButton } from "./BillingActionButton";
import { Group } from "@mantine/core";
import { IconX, IconCheck, IconEyeCheck } from "@tabler/icons";

export const BillingActionIcons = (props: {
  billingItem: BillingItem;
  deleteOneBillingLine: (key: string, billingMsg: string) => void;
  commitOneItem: (
    key: string,
    billingMsg: string,
    gmOverride?: boolean
  ) => void;
  openMjConfirmModal: (billingKey: string, msg: string) => void;
  showDeleteOneBillingLine: boolean;
  showCommitOneItem: boolean;
  showForceCommitOneItemButton: boolean;
}) => {
  const iconX = <IconX size={16} />;
  const deleteOneBillingLinebutton = (
    <BillingActionButton
      tooltipMsg="Annuler la ligne"
      actionHandler={props.deleteOneBillingLine}
      icon={iconX}
      billingItem={props.billingItem}
    />
  );
  const iconCheck = <IconCheck size={16} />;
  const commitOneItemButton = (
    <BillingActionButton
      tooltipMsg="Appliquer la ligne"
      actionHandler={props.commitOneItem}
      icon={iconCheck}
      billingItem={props.billingItem}
    />
  );

  const iconEyeCheck = <IconEyeCheck size={16} />;
  const forceCommitOneItemButton = (
    <BillingActionButton
      tooltipMsg="Appliquer la ligne sans payer de PA"
      actionHandler={props.openMjConfirmModal}
      icon={iconEyeCheck}
      billingItem={props.billingItem}
    />
  );

  const displayDeleteOneBillingLinebutton = props.showDeleteOneBillingLine
    ? deleteOneBillingLinebutton
    : null;
  const displayCommitOneItemButton = props.showCommitOneItem
    ? commitOneItemButton
    : null;
  const displayForceCommitOneItemButton = props.showForceCommitOneItemButton
    ? forceCommitOneItemButton
    : null;

  return (
    <Group>
      {displayDeleteOneBillingLinebutton}
      {displayCommitOneItemButton}
      {displayForceCommitOneItemButton}
    </Group>
  );
};
