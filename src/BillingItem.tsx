import { Table } from '@mantine/core';
import { ActionIcon, Dialog } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import React from 'react';
import { applyPatch, createPatch } from 'rfc6902';
import { showNotification } from '@mantine/notifications';
import { useStore, Personnage } from './App';
import { ReplaceOperation } from 'rfc6902/diff';

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
    const diffPathElements = diff.path.split("/");
    // diff.path looks like "/caracteristiques/force"
    const diffCategory = diffPathElements[1];
    switch (diffCategory) {
      case "caracteristiques":
        if (diff.op === "replace") {
          const caraName = diffPathElements[diffPathElements.length - 1];
          const casted: ReplaceOperation = diff;
          const val = casted.value;
          const originalValue = findDeepValueOfObjFromPathAndLeadingSep(originalPerso, diff.path, "/");
          const valDiff = val - originalValue;
          billingItems.push({
            key: diff.path,
            msg: caraName + ": " + originalValue + "->" + val,
            cost: valDiff * 4,
          });
        }
        break;

      default:
        break;
    }
  }
  return billingItems;
};

export interface IBillingItem {
  key: string;
  msg: string;
  cost: number;
}
export function calcBillingItemSum(billingItems: IBillingItem[]) {
  let sum = 0;
  if (billingItems) {
    for (const billingItem of billingItems) {
      sum += billingItem.cost;
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
  const setDraftPa = useStore((state) => state.setDraftPa);

  const billingItems = props.billingItems;
  const sum = calcBillingItemSum(billingItems);
  const availablePa = props.initialPa - sum;
  const deleteTheStuffHandler = (key: string) => {
    // key looks lioke "/caracteristiques/volonte"
    // I have to reset the value to the original number
    const differences = createPatch(originalPerso, currentPerso);
    const differencesMinusTheOneIWantToDelete = differences.filter(x => x.path != key);
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
              return (
                <tr key={billingItem.key}>
                  <td>-{billingItem.cost}</td>
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
              return;
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

  </Dialog>;
}
