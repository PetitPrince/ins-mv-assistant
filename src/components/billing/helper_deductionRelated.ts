import { Personnage } from "../../utils/const/Personnage";
import { BillingItem } from "./Billing";
import { generateBillingItems } from "./helper_generateBillingItems";
import { Operation } from "rfc6902";

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
  const {
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
