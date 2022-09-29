import { Personnage } from "../const/Personnage";

export const getCaracteristiqueLevel = (
  perso: Personnage,
  caraName?: string
) => {
  const caraPaDepense = caraName
    ? perso.caracteristiques[caraName].pa_depense
    : 0;
  return 2 + (Math.floor((10 * (caraPaDepense / 4)) / 5) * 5) / 10;
};

export const calcCaracteristiqueLevelFromPaDepense = (pa_depense: number) => {
  return 2 + (Math.floor((10 * (pa_depense / 4)) / 5) * 5) / 10;
};
