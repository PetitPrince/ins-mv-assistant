import { useStore } from "../../store/Store";
import { Personnage } from "../../utils/const/Personnage";
import {
  calcBillingItemSum,
  prepareCostDisplay,
  calcBillingItemsWithTalentDeductionLines,
  BillingActionIcons,
  cancelAllBillingitems,
  commitAllBillingItems,
  deleteOneBillingItem,
  assessCostAndCommitOneBillingItem2,
} from "./helper";
import { ScrollArea, Table, Tooltip } from "@mantine/core";
import { ActionIcon, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconChecks, IconTrashX } from "@tabler/icons";
import { applyPatch, createPatch } from "rfc6902";

export interface BillingItem {
  key: string;
  msg: string;
  cost: number | null;
  specialType?: string;
}

export const BillingPanel = (props: {}) => {
  const originalPerso = useStore((state) => state.originalPerso);
  const currentPerso = useStore((state) => state.currentPerso);
  const setCurrentPerso = useStore((state) => state.setCurrentPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);
  const setCurrentPa = useStore((state) => state.setCurrentPa);
  const setCurrentPaTotal = useStore((state) => state.setCurrentPaTotal);

  const currentPaTotal = useStore((state) => state.currentPerso.paTotal);
  const currentPa = currentPerso.pa;
  const differences = createPatch(originalPerso, currentPerso);

  let billingItems = calcBillingItemsWithTalentDeductionLines(
    differences,
    originalPerso,
    currentPerso
  ); // end deduction

  // For each points spent

  const sum = calcBillingItemSum(billingItems);

  const availablePa = currentPa - sum;

  const deleteOneBillingLine = (key: string, billingMsg: string) => {
    // key looks lioke "/caracteristiques/volonte/pa_depense"
    // I have to reset the value to the original number
    deleteOneBillingItem(originalPerso, currentPerso, key, setCurrentPerso);
    showNotification({
      title: "Ligne supprimée",
      message: billingMsg,
      color: "green",
    });
  };

  const commitOneItem = (
    key: string,
    billingMsg: string,
    skipCheckingPrice?: boolean
  ) => {
    assessCostAndCommitOneBillingItem2(
      billingItems,
      key,
      currentPerso,
      originalPerso,
      currentPaTotal,
      setOriginalPerso,
      setCurrentPa,
      setCurrentPaTotal,
      billingMsg,
      skipCheckingPrice
    );
  };

  const commitAllBillingLine = () => {
    // just get the talent extra points:
    commitAllBillingItems(
      originalPerso,
      currentPerso,
      availablePa,
      currentPa,
      setOriginalPerso,
      setCurrentPa,
      setCurrentPaTotal,
      currentPaTotal
    );
  };
  const cancelAllBillingLine = () => {
    // const unused = createPatch(originalPerso, currentPerso);
    cancelAllBillingitems(setCurrentPerso, originalPerso);
  };

  const commitAllButton = billingItems.length ? (
    <Tooltip label="Tout appliquer">
      <ActionIcon onClick={commitAllBillingLine}>
        <IconChecks size={16} />
      </ActionIcon>
    </Tooltip>
  ) : null;
  const cancelAllButton = billingItems.length ? (
    <Tooltip label="Tout annuler">
      <ActionIcon onClick={cancelAllBillingLine}>
        <IconTrashX size={16} />
      </ActionIcon>
    </Tooltip>
  ) : null;

  const openMjConfirmModal = (billingKey: string, msg: string) =>
    openConfirmModal({
      title: "Est-ce que le MJ accepte cette modification ?",
      children: <Text size="sm">{msg}</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("cancelled"),
      onConfirm: () => commitOneItem(billingKey, msg, true),
    });

  return (
    <>
      <ScrollArea.Autosize maxHeight={400} type="always">
        <Table
          verticalSpacing="xs"
          sx={{
            "& thead tr th:last-child": { width: 150 },
          }}
        >
          <thead>
            <tr>
              <th>PA</th>
              <th>Item</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{currentPa}</td>
              <td> Initial</td>
            </tr>
            {billingItems.map((billingItem) => {
              if (Object.keys(billingItem).length) {
                const cost = billingItem.cost;
                const costDisplay = prepareCostDisplay(cost);
                let showDeleteOneBillingLine = true;
                let showCommitOneItem = true;
                let showForceCommitOneItemButton = true;
                if (
                  ["noAction", "remainingTalentPa"].includes(
                    billingItem.specialType ? billingItem.specialType : ""
                  )
                ) {
                  showDeleteOneBillingLine = false;
                  showCommitOneItem = false;
                  showForceCommitOneItemButton = false;
                } else if (billingItem.specialType === "noIndividualCommit") {
                  showCommitOneItem = false;
                }

                return (
                  <tr key={billingItem.key}>
                    <td>{costDisplay}</td>
                    <td>{billingItem.msg}</td>
                    <td>
                      <BillingActionIcons
                        billingItem={billingItem}
                        deleteOneBillingLine={deleteOneBillingLine}
                        commitOneItem={commitOneItem}
                        openMjConfirmModal={openMjConfirmModal}
                        showDeleteOneBillingLine={showDeleteOneBillingLine}
                        showCommitOneItem={showCommitOneItem}
                        showForceCommitOneItemButton={
                          showForceCommitOneItemButton
                        }
                      />
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </Table>
      </ScrollArea.Autosize>
      <Table>
        <tbody>
          <tr>
            <td>{availablePa}</td>
            <td> total</td>
            <td>
              {" "}
              {commitAllButton} {cancelAllButton}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
