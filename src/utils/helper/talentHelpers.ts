import { Talent } from "../const/TalentStandard";

export const talentExistsInCollection = (
    currentTalentCollection: Talent[],
    talentId: string
  ) => {
    return currentTalentCollection.some((t) => t.id === talentId);
  };
export const findTalentInCollection = (talentId: string, talentCollection: Talent[]) => {
    return talentCollection.find((t) => t.id === talentId);
  }
  