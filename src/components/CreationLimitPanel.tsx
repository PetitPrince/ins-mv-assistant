import { useStore } from "../store/Store";
import { FACTIONS_NAMES } from "../utils/const/Factions";
import { LimitSliderThingy } from "./limitSliderThingy";
import { Stack, Group, Text } from "@mantine/core";

export const CreationLimitPanel = (props: {}) => {
  const faction = useStore((state) => state.currentPerso.faction);
  const cara = useStore((state) => state.currentPerso.caracteristiques);
  const talents = useStore((state) => state.currentPerso.talents);
  const pouvoirs = useStore((state) => state.currentPerso.pouvoirs);
  // Cara
  const sumPaDpenseCara =
    cara.force.pa_depense +
    cara.agilite.pa_depense +
    cara.perception.pa_depense +
    cara.volonte.pa_depense +
    cara.presence.pa_depense +
    cara.foi.pa_depense;

  let lowerLimitCara = 20,
    upperLimitCara = 50,
    avgSpentCara = 20;
  if (faction === FACTIONS_NAMES.ANGES) {
    lowerLimitCara = 20;
    upperLimitCara = 50;
    avgSpentCara = 40;
  } else if (faction === FACTIONS_NAMES.DEMONS) {
    lowerLimitCara = 16;
    upperLimitCara = 40;
    avgSpentCara = 24;
  }
  const isErrorCara = isTraitInRange(
    sumPaDpenseCara,
    lowerLimitCara,
    upperLimitCara
  );

  // Status  - PP
  const sumPaDpensePP = useStore((state) => state.currentPerso.pp_pa_depense);
  let lowerLimitPP = 2,
    upperLimitPP = 10,
    avgSpentPP = 4;
  if (faction === FACTIONS_NAMES.ANGES) {
    lowerLimitPP = 2;
    upperLimitPP = 10;
    avgSpentPP = 4;
  } else if (faction === FACTIONS_NAMES.DEMONS) {
    lowerLimitPP = 2;
    upperLimitPP = 10;
    avgSpentPP = 4;
  }
  const isErrorPP = isTraitInRange(sumPaDpensePP, lowerLimitPP, upperLimitPP);

  // Talents

  const paDepenseTalentsPrincipaux = Object.values(talents.principaux).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );
  const paDepenseTalentsSecondaire = Object.values(talents.secondaires).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );
  const paDepenseTalentsExotique = Object.values(talents.exotiques).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );

  const talentSecondaireContribution = Math.floor(
    (paDepenseTalentsSecondaire - paDepenseTalentsPrincipaux) / 2
  );

  const sumPaDpenseTalents =
    paDepenseTalentsPrincipaux +
    talentSecondaireContribution +
    paDepenseTalentsExotique;
  let lowerLimitTalents = 20,
    upperLimitTalents = 50,
    avgSpentTalents = 23;
  if (faction === FACTIONS_NAMES.ANGES) {
    lowerLimitTalents = 25;
    upperLimitTalents = 50;
    avgSpentTalents = 32;
  } else if (faction === FACTIONS_NAMES.DEMONS) {
    lowerLimitTalents = 20;
    upperLimitTalents = 40;
    avgSpentTalents = 28;
  }
  const isErrorTalents = isTraitInRange(
    sumPaDpenseTalents,
    lowerLimitTalents,
    upperLimitTalents
  );

  // Pouvoirs
  const sumPaDpensePouvoirs = Object.values(pouvoirs).reduce(
    (totalValue, currentValue) => {
      return totalValue + currentValue.pa_depense;
    },
    0
  );
  let lowerLimitPouvoirs = 20,
    upperLimitPouvoirs = 35,
    avgSpentPouvoirs = 23;
  if (faction === FACTIONS_NAMES.ANGES) {
    lowerLimitPouvoirs = 20;
    upperLimitPouvoirs = 35;
    avgSpentPouvoirs = 24;
  } else if (faction === FACTIONS_NAMES.DEMONS) {
    lowerLimitPouvoirs = 20;
    upperLimitPouvoirs = 28;
    avgSpentPouvoirs = 24;
  }
  const isErrorPouvoirs = isTraitInRange(
    sumPaDpensePouvoirs,
    lowerLimitPouvoirs,
    upperLimitPouvoirs
  );

  return (
    <Stack>
      <Group>
        <LimitSliderThingy
          title="Cara"
          currentValue={sumPaDpenseCara}
          lowerLimit={lowerLimitCara}
          upperLimit={upperLimitCara}
          avgSpent={avgSpentCara}
          max={60}
        />
        <LimitSliderThingy
          title="PP"
          currentValue={sumPaDpensePP}
          lowerLimit={lowerLimitPP}
          upperLimit={upperLimitPP}
          avgSpent={avgSpentPP}
          max={12}
        />
        <LimitSliderThingy
          title="Talents"
          currentValue={sumPaDpenseTalents}
          lowerLimit={lowerLimitTalents}
          upperLimit={upperLimitTalents}
          avgSpent={avgSpentTalents}
          max={60}
        />
        <LimitSliderThingy
          title="Pouvoirs"
          currentValue={sumPaDpensePouvoirs}
          lowerLimit={lowerLimitPouvoirs}
          upperLimit={upperLimitPouvoirs}
          avgSpent={avgSpentPouvoirs}
          max={40}
        />
      </Group>
    </Stack>
  );
};
export const isTraitInRange = (
  trait: number,
  lowerLimit: number,
  upperLimit: number
) => {
  return trait < lowerLimit || trait > upperLimit;
};
