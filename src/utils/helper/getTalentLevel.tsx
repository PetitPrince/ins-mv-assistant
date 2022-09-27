import { Personnage } from "../const/Personnage";
import { findStandardTalentById } from "../const/TalentStandard";
import { getCaracteristiqueLevel } from "./getCaracteristiqueLevel";

export const getTalentLevel = (perso: Personnage, talentId: string) => {
  let existingTalent;

  if (Object.hasOwn(perso.talents.principaux, talentId)) {
    existingTalent = perso.talents.principaux[talentId];
  } else if (Object.hasOwn(perso.talents.secondaires, talentId)) {
    existingTalent = perso.talents.secondaires[talentId];
  } else if (Object.hasOwn(perso.talents.exotiques, talentId)) {
    existingTalent = perso.talents.exotiques[talentId];
  } else {
    existingTalent = { pa_depense: 0 };
  }

  let associatedCara = findStandardTalentById(talentId)?.associatedChara;

  let levelFromAssociatedChara = 0;
  if (associatedCara !== "Aucune") {
    levelFromAssociatedChara =
      getCaracteristiqueLevel(perso, associatedCara) / 2;
  }

  const levelFromPa = existingTalent.pa_depense / 2;
  return levelFromPa + levelFromAssociatedChara;
};
