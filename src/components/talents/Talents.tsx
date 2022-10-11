import { APPMODE } from "../../APPMODE";
import { useStore } from "../../store/Store";
import { FACTIONS_NAMES } from "../../utils/const/Factions";
import { TalentsExotiques } from "./TalentsExotiques";
import { TalentsPrincipaux } from "./TalentsPrincipaux";
import { TalentsSecondaires } from "./TalentsSecondaires";
import { Group, Indicator, Title, Tooltip } from "@mantine/core";
import { Stack } from "@mantine/core";

export const Talents = (props: {}) => {
  const appMode = useStore((state) => state.appMode);
  const talents = useStore((state) => state.currentPerso.talents);
  const faction = useStore((state) => state.currentPerso.faction);
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

  const talentSecondaireContribution =
    paDepenseTalentsSecondaire - paDepenseTalentsPrincipaux > 0
      ? Math.floor(
          (paDepenseTalentsSecondaire - paDepenseTalentsPrincipaux) / 2
        )
      : 0;

  const sum =
    paDepenseTalentsPrincipaux +
    talentSecondaireContribution +
    paDepenseTalentsExotique;

  let creationLimitMsg = "";
  let lowerLimit = 20;
  let upperLimit = 50;
  let avgSpent = 23;
  let isError = false;
  if (appMode === APPMODE.CREATE) {
    if (faction === FACTIONS_NAMES.ANGES) {
      lowerLimit = 25;
      upperLimit = 50;
      avgSpent = 32;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les anges doivent dépenser entre 25 et 50 PA dans les talents (en moyenne 32).";
        isError = true;
      }
    } else if (faction === FACTIONS_NAMES.DEMONS) {
      lowerLimit = 20;
      upperLimit = 40;
      avgSpent = 28;
      if (sum < lowerLimit || sum > upperLimit) {
        creationLimitMsg =
          "Les démons doivent dépenser entre 20 et 40 PA dans les talents (en moyenne 28).";
        isError = true;
      }
    }
  }

  return (
    <Stack>
      <Group sx={{ "align-items": "flex-end" }}>
        <Tooltip multiline label={creationLimitMsg} disabled={!isError}>
          <Indicator position="top-start" color="red" disabled={!isError}>
            <Title order={2}>Talents</Title>
          </Indicator>
        </Tooltip>
      </Group>
      <TalentsPrincipaux />
      <TalentsSecondaires />
      <TalentsExotiques />
    </Stack>
  );
};
