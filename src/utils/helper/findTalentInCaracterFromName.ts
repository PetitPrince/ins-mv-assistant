import { Personnage } from "../const/Personnage";

export const findTalentInCaracterFromName = (
  currentPerso: Personnage,
  talentId: string
) => {
  let existingTalent;
  if (Object.hasOwn(currentPerso.talents.principaux, talentId)) {
    existingTalent = currentPerso.talents.principaux[talentId];
  } else if (Object.hasOwn(currentPerso.talents.secondaires, talentId)) {
    existingTalent = currentPerso.talents.secondaires[talentId];
  } else if (Object.hasOwn(currentPerso.talents.exotiques, talentId)) {
    existingTalent = currentPerso.talents.secondaires[talentId];
  }
  return existingTalent;
};
