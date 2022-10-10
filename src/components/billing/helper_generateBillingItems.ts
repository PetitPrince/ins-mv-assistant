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
import { Operation } from "rfc6902";

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
          let updatedCost = null; // if appmode is update -> faction change should be impossible
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
