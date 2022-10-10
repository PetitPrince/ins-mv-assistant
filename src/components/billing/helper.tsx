import { Personnage } from "../../utils/const/Personnage";
import { Talent } from "../../utils/const/TalentStandard";
import { findDeepValueOfObjFromPathAndLeadingSep } from "../../utils/helper/findDeepValueOfObjFromPathAndLeadingSep";
import {
  calcCaracteristiqueLevelFromPaDepense,
  getCaracteristiqueLevel,
} from "../../utils/helper/getCaracteristiqueLevel";
import { getPouvoirLevel } from "../../utils/helper/getPouvoirLevel";
import { calcTalentLevelFromPaDepense } from "../../utils/helper/getTalentLevel";
import { calcPPFromPaDepense } from "../status/Status";
import { BillingItem } from "./Billing";
import { Tooltip, ActionIcon, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck, IconEyeCheck } from "@tabler/icons";
import { applyPatch, createPatch, Operation } from "rfc6902";

export const generateBillingItems = (
  differences: Operation[],
  originalPerso: Personnage,
  currentPerso: Personnage
) => {
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
        case "equipements":
          if (diff.op === "add") {
            const equipementId = diffPathElements[2];
            const equipementName = currentPerso.equipements[equipementId].nom;
            billingItems.push({
              key: diff.path,
              msg: equipementName,
              cost: diff.value.coutEnPP,
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

export const prepareCostDisplay = (cost: number | null | undefined) => {
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
export const cancelAllBillingitems = (
  setCurrentPerso: (val: Personnage) => void,
  originalPerso: Personnage
) => {
  setCurrentPerso(originalPerso);
  showNotification({
    message: "Tout est revenu comme avant",
    color: "green",
  });
};

export const commitAllBillingItems = (
  originalPerso: Personnage,
  currentPerso: Personnage,
  availablePa: number,
  currentPa: number,
  setOriginalPerso: (val: Personnage) => void,
  setCurrentPa: (val: number) => void,
  setCurrentPaTotal: (val: number) => void,
  currentPaTotal: number
) => {
  const differences = createPatch(originalPerso, currentPerso);

  const billingItems = calcBillingItemsWithTalentDeductionLines(
    differences,
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

export const assessCostAndCommitOneBillingItem2 = (
  billingItems: BillingItem[],
  key: string,
  currentPerso: Personnage,
  originalPerso: Personnage,
  currentPaTotal: number,
  setOriginalPerso: (val: Personnage) => void,
  setCurrentPa: (val: number) => void,
  setCurrentPaTotal: (val: number) => void,
  billingMsg: string,
  skipCheckingPrice?: boolean
) => {
  const computedCost = billingItems.filter((x) => x.key === key)[0].cost;
  const cost = computedCost ? computedCost : 0;
  let isCheckingPrice = true;
  if (skipCheckingPrice) {
    isCheckingPrice = false;
  }

  if (isCheckingPrice && currentPerso.pa - cost < 0) {
    showNotification({
      title: "Pas assez de PA",
      message: "Il manque " + -(currentPerso.pa - cost) + " PA.",
      color: "red",
    });
  } else {
    const difference = createPatch(originalPerso, currentPerso);
    const differenceWithOnlyTheOneSelected = difference.filter(
      (x) => x.path === key
    );
    let paAfterTransaction = currentPerso.pa - cost;
    let newPaTotal = currentPaTotal + cost;

    commitOneDifference(
      originalPerso,
      differenceWithOnlyTheOneSelected,
      setOriginalPerso
    );
    setCurrentPa(paAfterTransaction);
    setCurrentPaTotal(newPaTotal);

    showNotification({
      title: "Ligne appliquée",
      message: "C'est celle là: " + billingMsg, // todo: using billingmsg is lazy, we should be able to recompute it from the billingitem (and have a common func)
      color: "green",
    });
  }
};

export const calcBillingItemsWithTalentDeductionLines = (
  differences: Operation[],
  originalPerso: Personnage,
  currentPerso: Personnage
) => {
  let billingItems = generateBillingItems(
    differences,
    originalPerso,
    currentPerso
  );

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
};

export const calcDeduction = (
  primaryTalentUpdates: BillingItem[],
  secondaryTalentUpdates: BillingItem[]
) => {
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
};

export const calcSecondaryCost = (secondaryTalentUpdates: BillingItem[]) => {
  return secondaryTalentUpdates
    .map((x) => (x.cost ? x.cost : 0))
    .reduce((sum, val) => {
      return sum + val;
    }, 0);
};

export const calcPrimaryDeduction = (primaryTalentUpdates: BillingItem[]) => {
  let deducPrimary = 0;
  // In any case I have a deduction based on the PA spent on primary talents
  primaryTalentUpdates.forEach((x) => {
    deducPrimary += x.cost ? x.cost : 0;
  });
  return deducPrimary;
};

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
export const deleteOneBillingItem = (
  originalPerso: Personnage,
  currentPerso: Personnage,
  key: string,
  setCurrentPerso: (val: Personnage) => void
) => {
  const differences = createPatch(originalPerso, currentPerso);
  const differencesMinusTheOneIWantToDelete = differences.filter(
    (x) => x.path !== key
  );

  let persoCopy = JSON.parse(JSON.stringify(originalPerso)); // deep copy
  applyPatch(persoCopy, differencesMinusTheOneIWantToDelete);
  setCurrentPerso(persoCopy);
};
function commitOneDifference(
  originalPerso: Personnage,
  oneDifference: Operation[],
  setOriginalPerso: (val: Personnage) => void
) {
  let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
  applyPatch(persoCopy, oneDifference);
  setOriginalPerso(persoCopy);
}
