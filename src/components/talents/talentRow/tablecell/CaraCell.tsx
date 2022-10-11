import { CARACTERISTIQUE_NAMES } from "../../../../utils/const/Caracteristiques_names";
import { Text } from "@mantine/core";

export const CaraCell = (props: { cara: CARACTERISTIQUE_NAMES }) => {
  const { cara } = props;
  let caraAbbrev;
  switch (cara) {
    case CARACTERISTIQUE_NAMES.FORCE:
      caraAbbrev = "Fo";
      break;
    case CARACTERISTIQUE_NAMES.AGILITE:
      caraAbbrev = "Ag";
      break;
    case CARACTERISTIQUE_NAMES.PERCEPTION:
      caraAbbrev = "Pe";
      break;
    case CARACTERISTIQUE_NAMES.VOLONTE:
      caraAbbrev = "Vo";
      break;
    case CARACTERISTIQUE_NAMES.PRESENCE:
      caraAbbrev = "Pr";
      break;
    case CARACTERISTIQUE_NAMES.FOI:
      caraAbbrev = "Fo";
      break;

    default:
      caraAbbrev = "/";
      break;
  }
  return <Text>{caraAbbrev}</Text>;
};
