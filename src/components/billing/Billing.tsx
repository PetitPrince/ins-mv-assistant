import { useStore } from "../../store/Store";
import { Personnage } from "../../utils/const/Personnage";
import { Talent, TALENT_TYPE_NAME } from "../../utils/const/TalentStandard";
import { findDeepValueOfObjFromPathAndLeadingSep } from "../../utils/helper/findDeepValueOfObjFromPathAndLeadingSep";
import {
  calcCaracteristiqueLevelFromPaDepense,
  getCaracteristiqueLevel,
} from "../../utils/helper/getCaracteristiqueLevel";
import { getPouvoirLevel } from "../../utils/helper/getPouvoirLevel";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import { calcPPFromPaDepense } from "../status/Status";
import {
  Button,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Tooltip,
} from "@mantine/core";
import { ActionIcon, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconChecks,
  IconEyeCheck,
  IconTrashX,
  IconX,
} from "@tabler/icons";
import { useState } from "react";
import { applyPatch, createPatch } from "rfc6902";

export interface BillingItem {
  key: string;
  msg: string;
  cost: number | null;
  specialType?: string;
}

export const generateBillingItems = (
  originalPerso: Personnage,
  currentPerso: Personnage
) => {
  const differences = createPatch(originalPerso, currentPerso);
  let billingItems: BillingItem[] = [];
  // Base difference
  for (const diff of differences) {
    if (diff.op === "replace" || diff.op === "add") {
      const diffPathElements = diff.path.split("/"); // diff.path looks like "/caracteristiques/force"
      const diffCategory = diffPathElements[1];
      let originalValue;
      if (diff.op === "replace") {
        originalValue = findDeepValueOfObjFromPathAndLeadingSep(
          originalPerso,
          diff.path,
          "/"
        );
      } else {
        // assume add
        originalValue = 0;
      }
      const val = diff.op === "add" ? diff.value.pa_depense : diff.value;
      switch (diffCategory) {
        case "faction":
          let updatedCost = null; // TODO: check if creation or update (or rather, if update -> faction change shouldn't even be a possiblity)
          // if (val === FACTIONS_NAMES.ANGES) {
          //   updatedCost = -100;
          // } else if (val === FACTIONS_NAMES.DEMONS) {
          //   updatedCost = -80;
          // }
          billingItems.push({
            key: diff.path,
            msg: "Faction: " + originalValue + " → " + val,
            cost: updatedCost,
          });
          break;
        case "identite":
          billingItems.push({
            key: diff.path,
            msg: "Identité: " + originalValue + " → " + val,
            cost: null,
          });
          break;
        case "superieur":
          billingItems.push({
            key: diff.path,
            msg: "Supérieur: " + originalValue + " → " + val,
            cost: null,
          });
          break;
        case "grade":
          billingItems.push({
            key: diff.path,
            msg: "Grade: " + originalValue + " → " + val,
            cost: null,
          });
          break;
        case "pp_pa_depense":
          const volonte = calcCaracteristiqueLevelFromPaDepense(
            currentPerso.caracteristiques.volonte.pa_depense
          );
          const foi = calcCaracteristiqueLevelFromPaDepense(
            currentPerso.caracteristiques.foi.pa_depense
          );
          const originalPP = calcPPFromPaDepense(volonte, foi, originalValue);
          const finalPP = calcPPFromPaDepense(volonte, foi, val);
          const valDiff = val - originalValue;

          billingItems.push({
            key: diff.path,
            msg: "PP: " + originalPP + " → " + finalPP,
            cost: valDiff,
          });

          break;
        case "caracteristiques":
          {
            // it's always replace for caracteristiques
            const caraName = diffPathElements[2];
            // diff.value is the number of PA spent on one cara.
            const valDiff = val - originalValue;
            billingItems.push({
              key: diff.path,
              msg:
                caraName +
                ": " +
                getCaracteristiqueLevel(originalPerso, caraName) +
                " → " +
                getCaracteristiqueLevel(currentPerso, caraName),
              cost: valDiff,
            });
          }
          break;
        case "talents":
          if (diff.op === "add") {
            const newTalent: Talent = diff.value;
            const finalLvl = calcTalentLevelFromPaDepense(
              newTalent.pa_depense,
              newTalent,
              currentPerso.caracteristiques
            );
            const nameFragment = newTalent.customNameFragment
              ? " (" + newTalent.customNameFragment + ")"
              : "";
            const msgString =
              "Talent " +
              newTalent.name +
              nameFragment +
              ": " +
              0 +
              " → " +
              finalLvl;
            const valDiff = newTalent.pa_depense;
            billingItems.push({
              key: diff.path,
              msg: msgString,
              cost: valDiff,
              specialType: "noIndividualCommit",
            });
          } else if (diff.op === "replace") {
            const currentTalent = findDeepValueOfObjFromPathAndLeadingSep(
              currentPerso,
              diff.path.split("/").slice(0, -1).join("/"),
              "/"
            );

            const originalLvl = calcTalentLevelFromPaDepense(
              originalValue,
              currentTalent,
              currentPerso.caracteristiques
            );
            const finalLvl = calcTalentLevelFromPaDepense(
              val,
              currentTalent,
              currentPerso.caracteristiques
            );
            const valDiff = val - originalValue;

            const nameFragment = currentTalent.customNameFragment
              ? " (" + currentTalent.customNameFragment + ")"
              : "";
            const msgString =
              "Talent " +
              currentTalent.name +
              nameFragment +
              ":" +
              originalLvl +
              " → " +
              finalLvl;

            billingItems.push({
              key: diff.path,
              msg: msgString,
              cost: valDiff,
            });
          }
          break;

        case "pouvoirs":
          if (diff.op === "replace" || diff.op === "add") {
            const valDiff = val - originalValue;
            const pouvoirId = diffPathElements[2];
            const pouvoirName = currentPerso.pouvoirs[pouvoirId].nom;
            const oldPouvoirLevel = Object.hasOwn(
              originalPerso.pouvoirs,
              pouvoirId
            )
              ? getPouvoirLevel(originalPerso, pouvoirId)
              : 0;
            const finalPouvoirLevel = getPouvoirLevel(currentPerso, pouvoirId);
            billingItems.push({
              key: diff.path,
              msg:
                pouvoirName +
                ": " +
                oldPouvoirLevel +
                " → " +
                finalPouvoirLevel,
              cost: valDiff,
            });
          }
          break;
        case "pa":
          break;
        case "paTotal":
          break;
        default:
          console.log("Unhandled billing category : " + diffCategory);
          break;
      }
    }
  }

  return billingItems;
};

export const calcBillingItemSum = (billingItems: BillingItem[]) => {
  let sum = 0;
  if (billingItems) {
    for (const billingItem of billingItems) {
      if (billingItem.cost != null) {
        sum += billingItem.cost;
      }
    }
  }
  return sum;
};

const prepareCostDisplay = (cost: number | null | undefined) => {
  let costDisplay: string;
  if (cost === null || cost === undefined) {
    costDisplay = "/";
  } else if (cost < 0) {
    costDisplay = "+" + String(cost).split("-")[1];
  } else {
    costDisplay = "-" + cost;
  }
  return costDisplay;
};

export const BillingPanel = (props: {}) => {
  const originalPerso = useStore((state) => state.originalPerso);
  const currentPerso = useStore((state) => state.currentPerso);
  const setCurrentPerso = useStore((state) => state.setCurrentPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);
  const setCurrentPa = useStore((state) => state.setCurrentPa);
  const setCurrentPaTotal = useStore((state) => state.setCurrentPaTotal);
  const setCurrentExtraPaTalent = useStore(
    (state) => state.setCurrentExtraPaTalent
  );
  const currentPaTotal = useStore((state) => state.currentPerso.paTotal);
  const currentPa = currentPerso.pa;

  let billingItems = calcBillingItemsWithTalentDeductionLines(
    originalPerso,
    currentPerso
  ); // end deduction

  // For each points spent

  const sum = calcBillingItemSum(billingItems);

  const availablePa = currentPa - sum;

  const deleteOneBillingLine = (key: string, billingMsg: string) => {
    // key looks lioke "/caracteristiques/volonte/pa_depense"
    // I have to reset the value to the original number
    const differences = createPatch(originalPerso, currentPerso);
    const differencesMinusTheOneIWantToDelete = differences.filter(
      (x) => x.path !== key
    );

    let persoCopy = JSON.parse(JSON.stringify(originalPerso)); // deep copy
    applyPatch(persoCopy, differencesMinusTheOneIWantToDelete);
    setCurrentPerso(persoCopy);
    showNotification({
      title: "Ligne supprimée",
      message: billingMsg,
      color: "green",
    });
  };

  const commitOneItem = (
    key: string,
    billingMsg: string,
    gmOverride: boolean
  ) => {
    const cost = billingItems.filter((x) => x.key === key)[0].cost;

    if (cost != null) {
      // key still looks like "/caracteristiques/volonte/pa_depense"
      // Create a patch with only one line selected, then apply it
      const paAfterTransaction = currentPerso.pa - cost;
      if (paAfterTransaction >= 0 || gmOverride) {
        // We have enough PA
        const difference = createPatch(originalPerso, currentPerso);
        const differenceWithOnlyTheOneSelected = difference.filter(
          (x) => x.path === key
        );
        let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
        applyPatch(persoCopy, differenceWithOnlyTheOneSelected);

        if (!gmOverride) {
          persoCopy.pa = paAfterTransaction; // Don't forget to update the PA
          persoCopy.paTotal = currentPaTotal + cost;
        }
        setOriginalPerso(persoCopy);
        if (!gmOverride) {
          setCurrentPa(paAfterTransaction);
          setCurrentPaTotal(currentPaTotal + cost);
        }

        showNotification({
          title: "Ligne appliquée",
          message: "C'est celle là: " + billingMsg,
          color: "green",
        });
      } else {
        // We don't have enough PA
        showNotification({
          title: "Pas assez de PA",
          message: "Il manque " + -paAfterTransaction + " PA.",
          color: "red",
        });
      }
    } else {
      // A null cost is the same as an update without updating the PA
      // Update without updating PA
      const difference = createPatch(originalPerso, currentPerso);
      const differenceWithOnlyTheOneSelected = difference.filter(
        (x) => x.path === key
      );
      let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso));
      applyPatch(persoCopy, differenceWithOnlyTheOneSelected);
      setOriginalPerso(persoCopy);
      showNotification({
        title: "Ligne appliquée",
        message: "C'est celle là: " + billingMsg,
        color: "green",
      });
    }
  };

  const commitAllBillingLine = () => {
    // just get the talent extra points:
    const billingItems = calcBillingItemsWithTalentDeductionLines(
      originalPerso,
      currentPerso
    );
    const remainingTalentPaBillingItem = billingItems.find(
      (x) => x.specialType === "remainingTalentPa"
    );

    if (remainingTalentPaBillingItem) {
      showNotification({
        title: "Il reste des PAs obligatoire à dépenser",
        message: remainingTalentPaBillingItem.msg,
        color: "red",
      });
    } else if (availablePa < 0) {
      showNotification({
        title: "Pas assez de PA",
        message: "Il manque " + -availablePa + " PA.",
        color: "red",
      });
    } else {
      // const unused = createPatch(originalPerso, currentPerso);
      const cost = currentPa - availablePa;

      setOriginalPerso(currentPerso);
      setCurrentPa(availablePa);
      setCurrentPaTotal(currentPaTotal + cost);
      showNotification({
        message: "Toutes les modifications ont été appliquées",
        color: "green",
      });
    }
  };
  const cancelAllBillingLine = () => {
    // const unused = createPatch(originalPerso, currentPerso);
    setCurrentPerso(originalPerso);
    showNotification({
      message: "Tout est revenu comme avant",
      color: "green",
    });
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

  const [modalOpened, setModalOpened] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalKey, setModalKey] = useState("");

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Est-ce que le MJ accepte cette modification ?"
        styles={(theme) => ({
          title: {
            fontWeight: 600,
          },
        })}
        // 	.mantine-Modal-title
      >
        <Stack>
          <Text>{modalContent}</Text>
          <Group>
            <Button
              onClick={() => {
                commitOneItem(modalKey, modalContent, true);
                setModalOpened(false);
              }}
            >
              Ok
            </Button>
            <Button
              onClick={() => {
                setModalOpened(false);
              }}
            >
              Annuler
            </Button>
          </Group>
        </Stack>
      </Modal>
      <ScrollArea.Autosize maxHeight={300} type="always">
        <Table>
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
                let ActionIcons;
                if (billingItem.specialType === "noAction") {
                  ActionIcons = null;
                } else if (billingItem.specialType === "noIndividualCommit") {
                  ActionIcons = (
                    <>
                      <Tooltip label="Annuler la ligne">
                        <ActionIcon
                          onClick={(x: any) =>
                            deleteOneBillingLine(
                              billingItem.key,
                              billingItem.msg
                            )
                          }
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Appliquer la ligne sans payer de PA">
                        <ActionIcon
                          onClick={(x: any) => {
                            setModalOpened(true);
                            setModalContent(billingItem.msg);
                            setModalKey(billingItem.key);
                          }}
                        >
                          <IconEyeCheck size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  );
                } else {
                  ActionIcons = (
                    <>
                      <Tooltip label="Annuler la ligne">
                        <ActionIcon
                          onClick={(x: any) =>
                            deleteOneBillingLine(
                              billingItem.key,
                              billingItem.msg
                            )
                          }
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Appliquer la ligne">
                        <ActionIcon
                          onClick={(x: any) =>
                            commitOneItem(
                              billingItem.key,
                              billingItem.msg,
                              false
                            )
                          }
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Appliquer la ligne sans payer de PA">
                        <ActionIcon
                          onClick={(x: any) => {
                            setModalOpened(true);
                            setModalContent(billingItem.msg);
                            setModalKey(billingItem.key);
                          }}
                        >
                          <IconEyeCheck size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  );
                }

                return (
                  <tr key={billingItem.key}>
                    <td>{costDisplay}</td>
                    <td>{billingItem.msg}</td>
                    <td>{ActionIcons}</td>
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
function calcBillingItemsWithTalentDeductionLines(
  originalPerso: Personnage,
  currentPerso: Personnage
) {
  let billingItems = generateBillingItems(originalPerso, currentPerso);

  const secondaryTalentUpdates = billingItems.filter((x) =>
    x.key.includes("secondaires")
  );
  const primaryTalentUpdates = billingItems.filter((x) =>
    x.key.includes("principaux")
  );

  // Calc deduction
  var {
    deducPrimary,
    costAfterPrimaryDeduction,
    deducSecondary,
    remainingFreePoints,
  } = calcDeduction(primaryTalentUpdates, secondaryTalentUpdates);

  if (secondaryTalentUpdates.length > 0) {
    if (deducPrimary) {
      // don't show if there's no deduction
      const msgP =
        deducPrimary +
        " rangs de talent secondaires offert par les dépenses dans les talents principaux";
      billingItems.push({
        key: "freeSecondaryTalentPointsFromPrimarySpending",
        msg: msgP,
        cost: -deducPrimary,
        specialType: "noAction",
      });
    }

    if (costAfterPrimaryDeduction > 0 && deducSecondary) {
      // don't show if there's no deduction
      const msgS =
        deducSecondary +
        " rangs de talent secondaires offert par les dépenses dans les talents secondaires";
      billingItems.push({
        key: "freeSecondaryTalentPointsFromSecondaySpending",
        msg: msgS,
        cost: -deducSecondary,
        specialType: "noAction",
      });
    }
  }
  if (remainingFreePoints > 0) {
    billingItems.push({
      key: "remainingFreePointsWhat",
      msg:
        "Attention, il reste " +
        remainingFreePoints +
        " rangs de talent secondaire à utiliser",
      cost: null,
      specialType: "remainingTalentPa",
    });
  }
  return billingItems;
}

function calcDeduction(
  primaryTalentUpdates: BillingItem[],
  secondaryTalentUpdates: BillingItem[]
) {
  let deducPrimary = calcPrimaryDeduction(primaryTalentUpdates);
  const secondaryTalentCost = calcSecondaryCost(secondaryTalentUpdates);
  const costAfterPrimaryDeduction = secondaryTalentCost - deducPrimary;
  const remainingPrimaryFreePoints =
    deducPrimary - secondaryTalentCost > 0
      ? deducPrimary - secondaryTalentCost
      : 0;

  // half of the secondary talents point can be considered paid by the other half
  let deducSecondary = Math.floor(costAfterPrimaryDeduction / 2);
  let remainingFreePoints =
    remainingPrimaryFreePoints > 0
      ? remainingPrimaryFreePoints
      : costAfterPrimaryDeduction % 2;
  return {
    deducPrimary,
    costAfterPrimaryDeduction,
    deducSecondary,
    remainingFreePoints,
  };
}

function calcSecondaryCost(secondaryTalentUpdates: BillingItem[]) {
  return secondaryTalentUpdates
    .map((x) => (x.cost ? x.cost : 0))
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
}

function calcPrimaryDeduction(primaryTalentUpdates: BillingItem[]) {
  let deducPrimary = 0;
  // In any case I have a deduction based on the PA spent on primary talents
  primaryTalentUpdates.forEach((x) => {
    deducPrimary += x.cost ? x.cost : 0;
  });
  return deducPrimary;
}
