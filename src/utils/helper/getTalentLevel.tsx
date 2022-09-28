import { CARACTERISTIQUE_NAMES } from "../const/Caracteristiques_names";
import {
  Caracteristique,
  CaracteristiquesSet,
  Personnage,
} from "../const/Personnage";
import { findStandardTalentById, Talent2 } from "../const/TalentStandard";
import {
  calcCaracteristiqueLevelFromPaDepense,
  getCaracteristiqueLevel,
} from "./getCaracteristiqueLevel";

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

export const calcTalentLevelFromPaDepense = (
  pa_depense: number,
  talent: Talent2,
  caracteristiques?: CaracteristiquesSet
) => {
  let levelsFromCara = 0;
  if (
    talent.associatedChara !== CARACTERISTIQUE_NAMES.AUCUNE &&
    caracteristiques !== undefined
  ) {
    let associatedCaraPaDepense =
      caracteristiques[talent.associatedChara].pa_depense;
    levelsFromCara = calcCaracteristiqueLevelFromPaDepense(
      associatedCaraPaDepense
    );
  }
  const levelFromPa = (Math.floor((10 * (pa_depense / 2)) / 5) * 5) / 10;
  return levelsFromCara + levelFromPa;
};
