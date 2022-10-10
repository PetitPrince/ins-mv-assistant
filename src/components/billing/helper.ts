import { Personnage } from "../../utils/const/Personnage";
import { BillingItem } from "./Billing";
import { showNotification } from "@mantine/notifications";
import { applyPatch, createPatch, Operation } from "rfc6902";

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
  billingItems: BillingItem[],
  currentPerso: Personnage,
  currentRemainingPa: number,
  currentPa: number,
  setOriginalPerso: (val: Personnage) => void,
  setCurrentPa: (val: number) => void,
  setCurrentPaTotal: (val: number) => void,
  currentPaTotal: number
) => {
  const remainingTalentPaBillingItem = billingItems.find(
    (x) => x.specialType === "remainingTalentPa"
  );

  if (remainingTalentPaBillingItem) {
    showNotification({
      title: "Il reste des PAs obligatoire à dépenser",
      message: remainingTalentPaBillingItem.msg,
      color: "red",
    });
  } else if (currentRemainingPa < 0) {
    showNotification({
      title: "Pas assez de PA",
      message: "Il manque " + -currentRemainingPa + " PA.",
      color: "red",
    });
  } else {
    const cost = currentPa - currentRemainingPa;

    setOriginalPerso(currentPerso);
    setCurrentPa(currentRemainingPa);
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
