import { Talent2 } from "../const/TalentStandard";

export const talentExistsInCollection = (
    currentTalentCollection: Talent2[],
    talentId: string
  ) => {
    return currentTalentCollection.some((t) => t.id === talentId);
  };
export const findTalentInCollection = (talentId: string, talentCollection: Talent2[]) => {
    return talentCollection.find((t) => t.id === talentId);
  }
  