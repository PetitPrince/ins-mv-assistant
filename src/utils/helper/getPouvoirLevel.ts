import { Personnage } from "../const/Personnage";

export const getPouvoirLevel = (perso: Personnage, pouvoirId: string) => {
  const  existingPouvoir = perso.pouvoirs[pouvoirId];
  const  {coutEnPa, pa_depense} = existingPouvoir
  return (Math.floor((10 * (pa_depense / (coutEnPa*2))) / 5) * 5) / 10;
}