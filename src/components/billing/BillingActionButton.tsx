import { BillingItem } from "./Billing";
import { Tooltip, ActionIcon } from "@mantine/core";

export const BillingActionButton = (props: {
  icon: JSX.Element;
  tooltipMsg: string;
  billingItem: BillingItem;
  actionHandler: (key: string, billingMsg: string) => void;
}) => {
  return (
    <Tooltip label={props.tooltipMsg}>
      <ActionIcon
        onClick={(x: any) =>
          props.actionHandler(props.billingItem.key, props.billingItem.msg)
        }
      >
        {props.icon}
      </ActionIcon>
    </Tooltip>
  );
};
