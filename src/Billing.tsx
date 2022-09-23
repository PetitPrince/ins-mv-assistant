import { ScrollArea, Table } from '@mantine/core';
import { ActionIcon, Dialog } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import { applyPatch, createPatch } from 'rfc6902';
import { showNotification } from '@mantine/notifications';
import { Personnage, TOUS_LES_TALENTS } from './App';
import { useStore } from "./Store";
import { FACTIONS } from './myConst';
import { paToCarac } from './Caracteristiques';

export interface BillingItem {
  key: string;
  msg: string;
  cost: number | null;
}

let findDeepValueOfObjFromPathAndLeadingSep = function (obj: any, path: string, sep: string) {
  //@ts-ignore
  // eslint-disable-next-line
  for (var i = 1, path = path.split(sep), len = path.length; i < len; i++) {
    obj = obj[path[i]];
  };
  return obj;
};
export const generateBillingItems2 = (originalPerso: Personnage, currentPerso: Personnage) => {
  const differences = createPatch(originalPerso, currentPerso);
  let billingItems: BillingItem[] = [];
  for (const diff of differences) {
    if (diff.op === "replace" || diff.op === "add") {
      const diffPathElements = diff.path.split("/"); // diff.path looks like "/caracteristiques/force"
      const diffCategory = diffPathElements[1];
      let originalValue = findDeepValueOfObjFromPathAndLeadingSep(originalPerso, diff.path, "/");
      const val = diff.op === "add" ? diff.value.pa_depense : diff.value;
      switch (diffCategory) {
        case "caracteristiques":
          // it's always replace for caracteristiques

          const caraName = diffPathElements[2];
          // diff.value is the number of PA spent on one cara.
          const valDiff = val - originalValue;
          billingItems.push({
            key: diff.path,
            msg: caraName + ": " + paToCarac(originalValue) + " → " + paToCarac(val),
            cost: valDiff,
          });
          break;
      }
    }
  }
  return billingItems;
}
export const generateBillingItems = (originalPerso: Personnage, currentPerso: Personnage) => {
  const differences = createPatch(originalPerso, currentPerso);
  // Using naively `[, patches]= produceWithPatches(perso, notUsed => {return draftPerso})` will not produce a minimal set of changes to
  // get to the perso. It will instead says "Oh i'm replacing the old object by the new one", which is correct but not what I want for billing
  // I want to get each differences and calc the cost
  // For this I need to determine the path (cost differs according on what's updated)
  // then determine the difference. 
  // For most of the changes I assume the type of difference is "replace"
  // "add" should be only for talents (maybe?) and powers (for sure)
  // "remove" shouldn't ever be used
  let billingItems: BillingItem[] = [];

  for (const diff of differences) {
    console.log(diff);
    if (diff.op === "replace" || diff.op === "add") {
      const diffPathElements = diff.path.split("/"); // diff.path looks like "/caracteristiques/force"
      const diffCategory = diffPathElements[1];
      let originalValue = findDeepValueOfObjFromPathAndLeadingSep(originalPerso, diff.path, "/");
      const val = diff.op === "add" ? diff.value.niveau : diff.value;
      switch (diffCategory) {
        case "caracteristiques":
          const caraName = diffPathElements[diffPathElements.length - 1]; // TODO: a neater way would be use a caraDisplay string instead of a the id
          const valDiff = val - originalValue.niveau;
          billingItems.push({
            key: diff.path,
            msg: caraName + ": " + originalValue.niveau + " → " + val,
            cost: valDiff * 4,
          });
          break;
        case "faction":
          let updatedCost = null; // TODO: check if creation or update (or rather, if update -> faction change shouldn't even be a possiblity)
          if (val === FACTIONS.ANGES) {
            updatedCost = -100;
          } else if (val === FACTIONS.DEMONS) {
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
        case "talents":
          // Check if there's a standard talent existing
          const talentId = diffPathElements[3];
          let standardTalent = TOUS_LES_TALENTS.find(x => x.id === talentId)
          if (standardTalent === undefined) {
            console.log("Cannot find talent with id " + talentId);
          }

          // If not, maybe it's a specialized / multiple one; find the primary talent
          const standardTalentAgain = TOUS_LES_TALENTS.find(x => x.id === talentId.split('-')[0]);
          if (standardTalentAgain === undefined) {
            console.log("Cannot find primary talent for id " + talentId + ", breaking");
            break;
          }
          standardTalent = standardTalentAgain;

          // Calc cost here
          const associatedCara = standardTalent.associatedChara
          if (diff.op === "add") { // A new talent doesn't have an original value, so it's either the associated cara/2, or 1
            if (associatedCara === "Aucune") {
              originalValue = 1;
            } else {
              originalValue = Math.floor(currentPerso.caracteristiques[associatedCara].niveau / 2)
            }
          }
          const cost = (val - originalValue) * 2;

          // Craft message here
          let msgString = "Talent " + standardTalent.name + " " + originalValue + " → " + val;

          if (diff.path.includes("specifique")) {
            // Put the specialization name, otherwise default to "spécifique"
            const fragment = findDeepValueOfObjFromPathAndLeadingSep(currentPerso, diff.path, '/').customNameFragment;
            const specializationName = fragment ? fragment : "spécifique";
            msgString = "Talent " + standardTalent.name + " (" + specializationName + "): " + originalValue + " → " + val;
          }

          billingItems.push({
            key: diff.path,
            msg: msgString,
            cost: cost,
          });
          break;

        default:
          console.log("Unhandled billing category : " + diffCategory);
          break;
      }
    }
  }

  return billingItems;
};

export function calcBillingItemSum(billingItems: BillingItem[]) {
  let sum = 0;
  if (billingItems) {
    for (const billingItem of billingItems) {
      if (billingItem.cost != null) {
        sum += billingItem.cost;
      }
    }
  }
  return sum;
}

function prepareCostDisplay(cost: number | null | undefined){
  let costDisplay : string;
  if (cost == null && cost == undefined) {
    costDisplay = "/";
  } else if (cost < 0) {
    costDisplay = "+" + String(cost).split('-')[1];
  } else {
    costDisplay = "-" + cost;
  }
  return costDisplay
}


export function BillingPanel(props:{}){
  const billingItems = useStore((state) => state.billingItems);
  const sum = calcBillingItemSum(billingItems);

  const originalPerso = useStore((state) => state.originalPerso);
  const currentPerso = useStore((state) => state.currentPerso);

  const currentPa = useStore((state) => state.currentPerso.pa);
  const availablePa = currentPa - sum;

  const setPerso = useStore((state) => state.setPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);
  const setCurrentPa = useStore((state) => state.setCurrentPa);

  const deleteOneBillingLine = (key: string, billingMsg: string) => {
    // key looks lioke "/caracteristiques/volonte/pa_depense"
    // I have to reset the value to the original number
    const differences = createPatch(originalPerso, currentPerso);
    const differencesMinusTheOneIWantToDelete = differences.filter(x => x.path !== key);
    let persoCopy = JSON.parse(JSON.stringify(originalPerso)); // deep copy
    applyPatch(persoCopy, differencesMinusTheOneIWantToDelete);
    setPerso(persoCopy);
    showNotification({
      title: "Ligne supprimée",
      message: billingMsg,
      color: "green"
    });
  };

  const commitOneItem = (key: string, billingMsg: string) => {
    const cost = billingItems.filter(x => x.key === key)[0].cost;

    if (cost != null) {
      // key still looks like "/caracteristiques/volonte/pa_depense"
      // Create a patch with only one line selected, then apply it
      const paAfterTransaction = currentPerso.pa - cost;
      if (paAfterTransaction >= 0) { // We have enough PA
        const difference = createPatch(originalPerso, currentPerso);
        const differenceWithOnlyTheOneSelected = difference.filter(x => x.path === key);
        let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
        applyPatch(persoCopy, differenceWithOnlyTheOneSelected);

        persoCopy.pa = paAfterTransaction; // Don't forget to update the PA
        setOriginalPerso(persoCopy);
        setCurrentPa(paAfterTransaction);
        showNotification({
          title: "Ligne appliquée",
          message: "C'est celle là: " + billingMsg,
          color: "green"
        });
      } else { // We don't have enough PA
        showNotification({
          title: "Pas assez de PA",
          message: "Il manque " + -paAfterTransaction + " PA.",
          color: "red"
        });
      }
    } else { // A null cost is the same as an update without updating the PA
      // Update without updating PA
      const difference = createPatch(originalPerso, currentPerso);
      const differenceWithOnlyTheOneSelected = difference.filter(x => x.path === key);
      let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso));
      applyPatch(persoCopy, differenceWithOnlyTheOneSelected);
      setOriginalPerso(persoCopy);
      showNotification({
        title: "Ligne appliquée",
        message: "C'est celle là: " + billingMsg,
        color: "green"
      });
    }
  };

  const commitAllBillingLine = () => {
    if (availablePa >= 0) {
      setOriginalPerso(currentPerso);
      setCurrentPa(availablePa);
      showNotification({
        message: "Toutes les modifications ont été appliquée",
        color: "green"
      });
    } else {
      showNotification({
        title: "Pas assez de PA",
        message: "Il manque " + -availablePa + " PA.",
        color: "red"
      });
    }
  };


  const commitAllButton = billingItems.length ? (<ActionIcon
   onClick={commitAllBillingLine}
   >
    <IconCheck size={16} />
  </ActionIcon>) : null;
  return (<Dialog opened={true} position={{ top: 20, right: 20 }}>
    <ScrollArea.Autosize maxHeight={300}>
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
              const costDisplay = prepareCostDisplay(cost) ;

              return (
                <tr key={billingItem.key}>
                  <td>{costDisplay}</td>
                  <td>{billingItem.msg}</td>
                  <td>
                    <ActionIcon 
                    onClick={(x: any) => deleteOneBillingLine(billingItem.key, billingItem.msg)}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                    <ActionIcon
                     onClick={(x: any) => commitOneItem(billingItem.key, billingItem.msg)}
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
          <td> {commitAllButton}
          </td>
        </tr>
      </tbody>
    </Table>
  </Dialog>);

}