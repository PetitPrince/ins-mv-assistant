import { ScrollArea, Table } from '@mantine/core';
import { ActionIcon, Dialog } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import React from 'react';
import { applyPatch, createPatch } from 'rfc6902';
import { showNotification } from '@mantine/notifications';
import { useStore, Personnage, allTalents } from './App';
import { ReplaceOperation } from 'rfc6902/diff';
import { FACTIONS } from './myConst';

let findDeepValueOfObjFromPathAndLeadingSep = function (obj: any, path: string, sep: string) {
  //@ts-ignore
  for (var i = 1, path = path.split(sep), len = path.length; i < len; i++) {
    obj = obj[path[i]];
  };
  return obj;
};

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
  let billingItems: IBillingItem[] = [];

  for (const diff of differences) {
    console.log(diff);
    if (diff.op === "replace" || diff.op === "add") {
      const diffPathElements = diff.path.split("/");
      // diff.path looks like "/caracteristiques/force"
      const diffCategory = diffPathElements[1];
      let originalValue = findDeepValueOfObjFromPathAndLeadingSep(originalPerso, diff.path, "/");
      const val = diff.op === "add" ? diff.value.niveau : diff.value;
      switch (diffCategory) {
        case "caracteristiques":
          const caraName = diffPathElements[diffPathElements.length - 1];
          const valDiff = val - originalValue;
          billingItems.push({
            key: diff.path,
            msg: caraName + ": " + originalValue + " → " + val,
            cost: valDiff * 4,
          });
          break;
        case "faction":
          let updatedCost = null; // TODO: check if creation or update (or rather, if update -> faction change shouldn't even be a possiblity)
          if(val===FACTIONS.ANGES){
            updatedCost = -100;
          }else if(val===FACTIONS.DEMONS){
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
          const talentId = diffPathElements[3];
          const talentCategory = diffPathElements[2];
          let standardTalent = allTalents.find(x => x.id === talentId)
          if(standardTalent === undefined){            
            console.log("Cannot find talent with id "+ talentId);
          }
          const standardTalentAgain = allTalents.find(x => x.id === talentId.split('-')[0]);
          if(standardTalentAgain === undefined){            
            console.log("Cannot find talent with id "+ talentId);
            break;
          }
          standardTalent = standardTalentAgain;


          // Calc cost here

          const associatedCara = standardTalent.associatedChara
          if(diff.op === "add"){
            if(associatedCara==="Aucune"){
              originalValue=1;

            }else{
              originalValue=Math.floor(currentPerso.caracteristiques[associatedCara]/2)

            }
          } 
          let cost;
          if(talentCategory==="principaux"){
            cost = (val-originalValue)*2;
          }
          else if(talentCategory==="secondaires"){
            cost = (val-originalValue)*2;
            // TODO: but there's also the freepoints
          }
          else{ // assume exotique
            cost = val;
          }

          // Get name here
          let talentName = standardTalent.name;
          let msgString = "Talent " + standardTalent.name +" "+ originalValue + " → " + val;

          if(diff.path.includes("specifique")){
            //  talentName = findDeepValueOfObjFromPathAndLeadingSep(currentPerso, diff.path.split('/').slice(0, -1).join('/'), '/').customNameFragment;
            const fragment = findDeepValueOfObjFromPathAndLeadingSep(currentPerso, diff.path, '/').customNameFragment;
            talentName = fragment ? fragment : "spécifique";
            msgString = "Talent " + standardTalent.name + "(" + talentName + "): " + originalValue + " → " + val;
          }
          // TODO: something wrong here
          
          billingItems.push({
            key: diff.path,
            msg: msgString,
            cost: cost,
          });
          break;

        default:
          break;
      }
    }
  }

  return billingItems;
};

export interface IBillingItem {
  key: string;
  msg: string;
  cost: number | null;
}
export function calcBillingItemSum(billingItems: IBillingItem[]) {
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


export function BillingPanel(props: {
  billingItems: IBillingItem[];
  initialPa: number;
}) {
  const originalPerso = useStore((state) => state.originalPerso);
  const currentPerso = useStore((state) => state.currentPerso);
  const setPerso = useStore((state) => state.setPerso);
  const setOriginalPerso = useStore((state) => state.setOriginalPerso);
  const setDraftPa = useStore((state) => state.setCurrentPa);

  const billingItems = props.billingItems;
  const sum = calcBillingItemSum(billingItems);
  const availablePa = props.initialPa - sum;
  const deleteTheStuffHandler = (key: string) => {
    // key looks lioke "/caracteristiques/volonte"
    // I have to reset the value to the original number
    const differences = createPatch(originalPerso, currentPerso);
    const differencesMinusTheOneIWantToDelete = differences.filter(x => x.path !== key);
    let persoCopy = JSON.parse(JSON.stringify(originalPerso)); // deep copy
    applyPatch(persoCopy, differencesMinusTheOneIWantToDelete);
    setPerso(persoCopy);
    showNotification({
      message: "Delete ok!",
      color: "green"
    });
  };
  const commitOneItem = (key: string) => {
    const cost = billingItems.filter(x => x.key === key)[0].cost;
    if (cost != null) {
      const paAfterTransaction = currentPerso.pa - cost;
      // key still looks like "/caracteristiques/volonte"
      if (paAfterTransaction >= 0) { // only apply if we have enough pa
        const difference = createPatch(originalPerso, currentPerso);
        const differenceWithOnlyTheOneSelected = difference.filter(x => x.path === key);
        let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
        applyPatch(persoCopy, differenceWithOnlyTheOneSelected);

        // I need to update the pa
        persoCopy.pa = paAfterTransaction;
        // setPerso(persoCopy);
        setOriginalPerso(persoCopy);
        setDraftPa(paAfterTransaction);
        showNotification({
          message: "Commit ok!",
          color: "green"
        });
      } else {
        showNotification({
          id: "delete-billing-item-nok",
          message: "Pas assez de PA!",
          color: "red"
        });
      }
    } else {
      // Update without updating PA
      const difference = createPatch(originalPerso, currentPerso);
      const differenceWithOnlyTheOneSelected = difference.filter(x => x.path === key);
      let persoCopy: Personnage = JSON.parse(JSON.stringify(originalPerso)); // deep copy
      applyPatch(persoCopy, differenceWithOnlyTheOneSelected);
      setOriginalPerso(persoCopy);
      showNotification({
        message: "Commit ok!",
        color: "green"
      });
    }
    console.log(key);
  };


  const commitAll = () => {
    if (availablePa >= 0) {
      setOriginalPerso(currentPerso);
      setDraftPa(availablePa);
    } else {
      showNotification({
        id: "delete-billing-item-nok",
        message: "Pas assez de PA!",
        color: "red"
      });
    }
  };

  // TODO: sorting billingItems by key or name were would be a good idea
  // maybe use Dialog instead
  return <Dialog opened={true} position={{ top: 20, right: 20 }}>
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
          <td>{props.initialPa}</td>
          <td> Initial</td>
        </tr>

        {billingItems
          .map((billingItem) => {
            if (Object.keys(billingItem).length) {
              const cost = billingItem.cost;
              let costDisplay = String(cost);
              if (cost == null) {
                costDisplay = "/";
              } else if (cost < 0) {
                costDisplay = "+" + String(cost).split('-')[1];
              } else {
                costDisplay = "-" + cost;
              }
              return (
                <tr key={billingItem.key}>
                  <td>{costDisplay}</td>
                  <td>{billingItem.msg}</td>
                  <td>
                    <ActionIcon onClick={(x: any) => deleteTheStuffHandler(billingItem.key)}>
                      <IconX size={16} />
                    </ActionIcon>
                    <ActionIcon onClick={(x: any) => commitOneItem(billingItem.key)}>
                      <IconCheck size={16} />
                    </ActionIcon>
                  </td>
                </tr>

              );
            } else {
              return null;
            }
          })}
        <tr>
          <td>{availablePa}</td>
          <td> total</td>
          <td>
            <ActionIcon onClick={commitAll}>
              <IconCheck size={16} />
            </ActionIcon>
          </td>
        </tr>
      </tbody>
    </Table>
    </ScrollArea.Autosize>

  </Dialog>;
}
