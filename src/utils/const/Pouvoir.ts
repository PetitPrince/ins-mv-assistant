export interface PouvoirCollection {
    [key: string]: Pouvoir;
  }
export interface Pouvoir{
    id: string,
    nom: string,
    coutEnPP: string,
    coutEnPa: number,
    pa_depense: number,
}