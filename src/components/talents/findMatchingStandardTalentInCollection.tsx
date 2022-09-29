import { Talent } from "../../utils/const/TalentStandard";

export function findMatchingStandardTalentInCollection(
  talentCollection: Talent[],
  standardTalentCollection: Talent[]
) {
  const talentPrincipauxStandardIds = standardTalentCollection.map((x) => x.id);
  let toAdd: Talent[] = [];
  for (const onetalent of talentCollection) {
    if (talentPrincipauxStandardIds.includes(onetalent.id)) {
      const idx = standardTalentCollection.findIndex(
        (x) => x.id === onetalent.id
      );
      standardTalentCollection[idx] = onetalent;
    } else {
      toAdd.push(onetalent);
    }
  }
  return toAdd;
}
