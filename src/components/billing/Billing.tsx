import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { Personnage } from "../../utils/const/Personnage";
import { TOUS_LES_TALENTS } from "../../utils/const/TalentStandard";
import { findDeepValueOfObjFromPathAndLeadingSep } from "../../utils/helper/findDeepValueOfObjFromPathAndLeadingSep";
import { findTalentInCaracterFromName } from "../../utils/helper/findTalentInCaracterFromName";
import { getCaracteristiqueLevel } from "../../utils/helper/getCaracteristiqueLevel";
import { getPouvoirLevel } from "../../utils/helper/getPouvoirLevel";
import { getTalentLevel } from "../../utils/helper/getTalentLevel";
import { ScrollArea, Table } from "@mantine/core";
import { ActionIcon, Dialog } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { applyPatch, createPatch } from "rfc6902";

export interface BillingItem {
  key: string;
  msg: string;
  cost: number | null;
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
          if (val === FACTIONS_NAMES.ANGES) {
            updatedCost = -100;
          } else if (val === FACTIONS_NAMES.DEMONS) {
            updatedCost = -80;
          }
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
          {
            const talentId = diffPathElements[3];

            // First find the start talent to get its name
            let talentName = "";

            const standardTalent = TOUS_LES_TALENTS.find(
              (x) => x.id === talentId
            );
            const standardTalentOnlyThePrimaries = TOUS_LES_TALENTS.find(
              (x) => x.id === talentId.split("_")[0]
            );

            if (standardTalentOnlyThePrimaries !== undefined) {
              talentName = standardTalentOnlyThePrimaries.name;
              // console.log("Cannot find primary talent for id " + talentId);
            } else if (standardTalent !== undefined) {
              talentName = standardTalent.name;
            } else if (diff.op === "add" && diff.path.includes("exotiques")) {
              if (
                Object.keys(currentPerso.talents.exotiques).includes(talentId)
              ) {
                talentName = currentPerso.talents.exotiques[talentId].name;
              }
            }
            if (standardTalent === undefined) {
              // console.log("Cannot find talent with id " + talentId);
            }

            // Calc cost here
            let originalTalentValue = getTalentLevel(originalPerso, talentId);
            let finalTalentValue = getTalentLevel(currentPerso, talentId);
            let valDiff = val - originalValue;

            // Craft message here
            let msgString =
              "Talent " +
              talentName +
              " " +
              originalTalentValue +
              " → " +
              finalTalentValue;
            if (diff.path.includes("specifique")) {
              // Put the specialization name, otherwise default to "spécifique"
              const fragment = findDeepValueOfObjFromPathAndLeadingSep(
                currentPerso,
                diff.path,
                "/"
              ).customNameFragment;
              const specializationName = fragment ? fragment : "spécifique";
              msgString =
                "Talent " +
                talentName +
                " (" +
                specializationName +
                "): " +
                originalTalentValue +
                " → " +
                finalTalentValue;
            } else if (diff.path.includes("_")) {
              // TODO: not ideal but this means there's a "multiple" talent somewhere
              let existingTalent = findTalentInCaracterFromName(
                currentPerso,
                talentId
              );
              msgString =
                "Talent " +
                talentName +
                " (" +
                existingTalent?.customNameFragment +
                "): " +
                originalTalentValue +
                " → " +
                finalTalentValue;
            }

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
            const newPouvoirLevel = getPouvoirLevel(currentPerso, pouvoirId);
            billingItems.push({
              key: diff.path,
              msg:
                pouvoirName + ": " + oldPouvoirLevel + " → " + newPouvoirLevel,
              cost: valDiff,
            });
          }
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
  const currentPa = currentPerso.pa;

  let billingItems = generateBillingItems(originalPerso, currentPerso);

  const secondaryTalentUpdates = billingItems.filter((x) =>
    x.key.includes("secondaires")
  );
  const primaryTalentUpdates = billingItems.filter((x) =>
    x.key.includes("principaux")
  );

  if (secondaryTalentUpdates.length > 0) {
    let deducPrimary = 0;
    // In any case I have a deduction based on the PA spent on primary talents
    primaryTalentUpdates.forEach((x) => {
      deducPrimary += x.cost ? x.cost : 0;
    });

    // Let's apply the deduction
    const secondaryTalentCost = secondaryTalentUpdates
      .map((x) => (x.cost ? x.cost : 0))
      .reduce((sum, val) => {
        return sum + val;
      }, 0);
    const msgP =
      deducPrimary +
      " rangs offert par les dépenses dans les talents principaux";
    if (deducPrimary) {
      // don't show if there's no deduction
      billingItems.push({
        key: "freeSecondaryTalentPointsFromPrimarySpending",
        msg: msgP,
        cost: -deducPrimary,
      });
    }
    const costAfterDeduction = secondaryTalentCost - deducPrimary;

    if (costAfterDeduction > 0) {
      // half of the secondary talents point can be considered paid by the other half

      let deducSecondary = Math.floor(costAfterDeduction / 2);
      let remainingFreePoints = costAfterDeduction % 2;
      const msgS =
        deducSecondary +
        " rangs offert par les dépenses dans les talents secondaires (reste +" +
        remainingFreePoints +
        ")";
      if (deducSecondary) {
        // don't show if there's no deduction
        billingItems.push({
          key: "freeSecondaryTalentPointsFromSecondaySpending",
          msg: msgS,
          cost: -deducSecondary,
        });
      }
    }
  }

  // For each points spent

  const sum = calcBillingItemSum(billingItems);

  const availablePa = currentPa - sum;

  const setPerso = useStore((state) => state.setPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);
  const setCurrentPa = useStore((state) => state.setCurrentPa);

  const deleteOneBillingLine = (key: string, billingMsg: string) => {
    // key looks lioke "/caracteristiques/volonte/pa_depense"
    // I have to reset the value to the original number
    const differences = createPatch(originalPerso, currentPerso);
    const differencesMinusTheOneIWantToDelete = differences.filter(
      (x) => x.path !== key
    );
    let persoCopy = JSON.parse(JSON.stringify(originalPerso)); // deep copy
    applyPatch(persoCopy, differencesMinusTheOneIWantToDelete);
    setPerso(persoCopy);
    showNotification({
      title: "Ligne supprimée",
      message: billingMsg,
      color: "green",
    });
  };

  const commitOneItem = (key: string, billingMsg: string) => {
    const cost = billingItems.filter((x) => x.key === key)[0].cost;

    if (cost != null) {
      // key still looks like "/caracteristiques/volonte/pa_depense"
      // Create a patch with only one line selected, then apply it
      const paAfterTransaction = currentPerso.pa - cost;
      if (paAfterTransaction >= 0) {
        // We have enough PA
        const difference = createPatch(originalPerso, currentPerso);
        const differenceWithOnlyTheOneSelected = difference.filter(
          (x) => x.path === key
        );
        let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
        applyPatch(persoCopy, differenceWithOnlyTheOneSelected);

        persoCopy.pa = paAfterTransaction; // Don't forget to update the PA
        setOriginalPerso(persoCopy);
        setCurrentPa(paAfterTransaction);
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
    if (availablePa >= 0) {
      setOriginalPerso(currentPerso);
      setCurrentPa(availablePa);
      showNotification({
        message: "Toutes les modifications ont été appliquées",
        color: "green",
      });
    } else {
      showNotification({
        title: "Pas assez de PA",
        message: "Il manque " + -availablePa + " PA.",
        color: "red",
      });
    }
  };

  const commitAllButton = billingItems.length ? (
    <ActionIcon onClick={commitAllBillingLine}>
      <IconCheck size={16} />
    </ActionIcon>
  ) : null;

  return (
    <Dialog opened={true} position={{ top: 20, right: 20 }}>
      <ScrollArea.Autosize maxHeight={600}>
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

                return (
                  <tr key={billingItem.key}>
                    <td>{costDisplay}</td>
                    <td>{billingItem.msg}</td>
                    <td>
                      <ActionIcon
                        onClick={(x: any) =>
                          deleteOneBillingLine(billingItem.key, billingItem.msg)
                        }
                      >
                        <IconX size={16} />
                      </ActionIcon>
                      <ActionIcon
                        onClick={(x: any) =>
                          commitOneItem(billingItem.key, billingItem.msg)
                        }
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
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
            <td> {commitAllButton}</td>
          </tr>
        </tbody>
      </Table>
    </Dialog>
  );
};
