import { TalentStandard } from "../../utils/const/TalentStandard";
import { getCaracteristiqueLevel, getTalentLevel } from "../../store/Store";
import { Personnage, TalentInvestiCollection } from "../../utils/const/Personnage";
import { TalentDisplayRow } from "./Talents";

export const computeRowsTalents = (
  characterTalents: TalentInvestiCollection,
  currentPerso: Personnage,
  standardTalentCollection: TalentStandard[]
) => {
  let rows: TalentDisplayRow[] = [];

  // Go through the list of standard talents, display those who are present
  for (const standardTalent of standardTalentCollection) {
    const { name, id, associatedChara, isInnate, specialisationType } =
      standardTalent;
    switch (specialisationType) {
      case "Multiple":
        // Look for a family of talents in the character sheet, all starting with the same string (for instance all hobby, include "hobby" and
        // "hobby-dressage-de-bouquetin"). There could be an arbitrary number of them
        const characterTalentsStartingWithId = Object.entries(
          characterTalents
        ).filter(([k, v]) => k.startsWith(id));

        // For each on of them, add one row with their existing info
        for (const [
          existingTalentId,
          existingTalent,
        ] of characterTalentsStartingWithId) {
          rows.push({
            ...standardTalent,
            id: existingTalentId,
            name:
              standardTalent.name +
              " (" +
              existingTalent.customNameFragment +
              ")",
            level: getTalentLevel(currentPerso, existingTalentId), // TODO: it's a bit a roundabout way to get the current level
            pa_depense: existingTalent.pa_depense,
          });
        }
        // Also add a row to add a new one talent. The trigger is getting an undefined level
        rows.push({
          ...standardTalent,
          name: standardTalent.name + "...",
          level: undefined,
          pa_depense: 0,
        });
        break;

      case "Spécifique":
        // There's always a pair of Talent, The generic on doesn't have the "-specifique" suffix.
        const isSpecific = id.includes("specifique");

        // If the talent already exists in the character sheet, add a new row
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          const displayName = existingTalent.customNameFragment
            ? name + " (" + existingTalent.customNameFragment + ")"
            : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: getTalentLevel(currentPerso, id), // TODO: it's a bit a roundabout way to get the current level
            pa_depense: existingTalent.pa_depense,
          });
        } else {
          // otherwise add an empty row
          const defaultLevel = isInnate
            ? getCaracteristiqueLevel(currentPerso, associatedChara)
            : undefined;
          const displayName = isSpecific ? name + "(...)" : name;
          rows.push({
            ...standardTalent,
            name: displayName,
            level: defaultLevel,
            pa_depense: 0,
          });
        }
        break;
      case "Générique":
        // If the talent already exists in the character sheet, add a new row
        if (Object.hasOwn(characterTalents, id)) {
          const existingTalent = characterTalents[id];
          rows.push({
            ...standardTalent,
            level: getTalentLevel(currentPerso, id), // TODO: it's a bit a roundabout way to get the current level
            pa_depense: existingTalent.pa_depense,
          });
        } else {
          // otherwise add an empty row
          const defaultLevel = isInnate
            ? getCaracteristiqueLevel(currentPerso, associatedChara)
            : undefined;
          rows.push({
            ...standardTalent,
            level: defaultLevel,
            pa_depense: 0,
          });
        }
        break;
    }
  }
  return rows;
};
