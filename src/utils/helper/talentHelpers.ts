import { Talent, TalentCollection } from "../const/TalentStandard";

export const talentExistsInCollection = (
    currentTalentCollection: TalentCollection,
    talentId: string
  ) => {
    return Object.values(currentTalentCollection).some((t) => t.id === talentId);
  };
export const findTalentInCollection = (talentId: string, talentCollection: TalentCollection) => {
    return Object.values(talentCollection).find((t) => t.id === talentId);
  }
  