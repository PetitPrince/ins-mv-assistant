import { APPMODE } from "../APPMODE";
import { BillingItem } from "../components/billing/Billing";
import { CARACTERISTIQUE_NAMES } from "../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../utils/const/Factions";
import { Equipement, Personnage } from "../utils/const/Personnage";
import { Pouvoir } from "../utils/const/Pouvoir";
import { Talent } from "../utils/const/TalentStandard";
import produce, { Patch, produceWithPatches } from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";

// any operation in the app is done on the Personnage, and the billing sort out the rest
const emptyPersoDict = {
  identite: "",
  faction: FACTIONS_NAMES.AUTRE,
  superieur: "",
  grade: 0,
  caracteristiques: {
    force: {
      pa_depense: 0,
    },
    agilite: {
      pa_depense: 0,
    },
    perception: {
      pa_depense: 0,
    },
    volonte: {
      pa_depense: 0,
    },
    presence: {
      pa_depense: 0,
    },
    foi: {
      pa_depense: 0,
    },
  },
  pa: 0,
  extraPaTalent: 0,
  paTotal: 0,
  pp_pa_depense: 0,
  talents: {
    principaux: {},
    secondaires: {},
    exotiques: {},
  },
  equipements: {},
  pouvoirs: {},
};
// export const emptyPerso = new Personnage(emptyPersoDict);
export const emptyPerso = emptyPersoDict;

export const useStore = create<{
  currentPerso: Personnage;
  originalPerso: Personnage;
  billingItems: BillingItem[];
  paAfterBilling: number;
  appMode: APPMODE;
  historyUndo: Patch[];
  historyRedo: (Patch | Patch[])[];

  setAppMode: (appMode: string) => void;

  setCurrentTalentPrincipalPaDepense: (talentId: string, val: number) => void;
  addCurrentTalentPrincipal: (newTalent: Talent) => void;
  setCurrentTalentPrincipalNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  setCurrentTalentSecondairePaDepense: (talentId: string, val: number) => void;
  addCurrentTalentSecondaire: (newTalent: Talent) => void;
  setCurrentTalentSecondaireNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;
  setCurrentTalentExotiquePaDepense: (talentId: string, val: number) => void;
  addCurrentTalentExotique: (newTalent: Talent) => void;
  setCurrentTalentExotiqueNameFragment: (
    talentId: string,
    nameFragment: string
  ) => void;

  setCurrentPerso: (val: Personnage) => void;
  setOriginalPerso: (val: Personnage) => void;
  setCurrentIdentite: (val: string) => void;
  setCurrentFaction: (val: FACTIONS_NAMES) => void;
  setCurrentGrade: (val: number) => void;
  setCurrentSuperieur: (val: string) => void;
  setCurrentCaracteristiques: (
    val: number,
    caracteristique: CARACTERISTIQUE_NAMES
  ) => void;
  setCurrentCaracteristiquesPaDepense: (
    val: number,
    caracteristique: CARACTERISTIQUE_NAMES
  ) => void;
  setCurrentPa: (val: number) => void;
  setCurrentPaTotal: (val: number) => void;
  setCurrentPpPadepense: (val: number) => void;
  setCurrentFreeTalentPoints: (val: number) => void;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
  setCurrentPouvoir: (pouvoirId: string, val: Pouvoir) => void;
  deleteCurrentPouvoir: (pouvoirId: string) => void;
  setCurrentEquipement: (equipementId: string, val: Equipement) => void;
  deleteCurrentEquipement: (equipementId: string) => void;
}>()(
  persist(
    (set, get) => {
      return {
        currentPerso: emptyPerso,
        originalPerso: emptyPerso,
        billingItems: [],
        paAfterBilling: 0,
        appMode: APPMODE.CREATE,
        historyUndo: [],
        historyRedo: [],

        setAppMode: (appMode) => {
          set(
            produce((draftState) => {
              draftState.appMode = appMode;
            })
          );
        },

        setCurrentTalentPrincipalPaDepense: (talentId: string, val: number) => {
          const updatedTalentPrincipalArray = produce((draftState) => {
            draftState.currentPerso.talents.principaux[talentId].pa_depense =
              val;
          });
          set(updatedTalentPrincipalArray);
        },

        setCurrentTalentPrincipalNameFragment: (
          talentId: string,
          nameFragment: string
        ) => {
          const updatedTalentPrincipalArray = produce((draftState) => {
            draftState.currentPerso.talents.principaux[
              talentId
            ].customNameFragment = nameFragment;
          });
          set(updatedTalentPrincipalArray);
        },

        addCurrentTalentPrincipal: (newTalent: Talent) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.talents.principaux[newTalent.id] =
                newTalent;
            })
          );
        },
        setCurrentTalentSecondairePaDepense: (
          talentId: string,
          val: number
        ) => {
          const updatedTalentSecondaireArray = produce((draftState) => {
            draftState.currentPerso.talents.secondaires[talentId].pa_depense =
              val;
          });
          set(updatedTalentSecondaireArray);
        },

        setCurrentTalentSecondaireNameFragment: (
          talentId: string,
          nameFragment: string
        ) => {
          const updatedTalentSecondaireArray = produce((draftState) => {
            draftState.currentPerso.talents.secondaires[
              talentId
            ].customNameFragment = nameFragment;
          });
          set(updatedTalentSecondaireArray);
        },

        addCurrentTalentSecondaire: (newTalent: Talent) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.talents.secondaires[newTalent.id] =
                newTalent;
            })
          );
        },

        setCurrentTalentExotiquePaDepense: (talentId: string, val: number) => {
          const updatedTalentExotiqueArray = produce((draftState) => {
            draftState.currentPerso.talents.exotiques[talentId].pa_depense =
              val;
          });
          set(updatedTalentExotiqueArray);
        },

        setCurrentTalentExotiqueNameFragment: (
          talentId: string,
          nameFragment: string
        ) => {
          const updatedTalentExotiqueArray = produce((draftState) => {
            draftState.currentPerso.talents.exotiques[
              talentId
            ].customNameFragment = nameFragment;
          });
          set(updatedTalentExotiqueArray);
        },

        addCurrentTalentExotique: (newTalent: Talent) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.talents.exotiques[newTalent.id] =
                newTalent;
            })
          );
        },

        setCurrentPerso: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso = val;
            })
          );
        },
        setOriginalPerso: (val) => {
          set(
            produce((draftState) => {
              draftState.originalPerso = val;
            })
          );
        },
        setCurrentIdentite: (val) => {
          const [nextState, patches, inversePatches] = produceWithPatches(
            get(),
            (draftState) => {
              draftState.currentPerso.identite = val;
            }
          );
          get().historyRedo.push(...patches);
          get().historyRedo.push(...inversePatches);

          set(nextState);
        },
        setCurrentFaction: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.faction = val;
            })
          );
        },
        setCurrentGrade: (val) => {
          const newLocal = produce(get(), (draftState) => {
            draftState.currentPerso.grade = val;
          });
          console.log(newLocal);
          set(newLocal);
        },
        setCurrentSuperieur: (val) => {
          const [nextState, patches, inversePatches] = produceWithPatches(
            get(),
            (draftState) => {
              draftState.currentPerso.superieur = val;
            }
          );
          console.log(inversePatches);
          // get().historyUndo.push.apply(get().historyUndo, inversePatches));
          // console.log(get().historyUndo);

          set(nextState);
          set(
            produce((draftState) => {
              draftState.historyRedo.push(patches);
              draftState.historyUndo.push(inversePatches);
            })
          );
        },
        setCurrentCaracteristiques: (val, cara) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.caracteristiques[cara] = val;
            })
          );
        },
        setCurrentCaracteristiquesPaDepense: (val, cara) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.caracteristiques[cara].pa_depense = val;
            })
          );
        },

        setCurrentPa: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.pa = val;
            })
          );
        },

        setCurrentPaTotal: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.paTotal = val;
            })
          );
        },
        setCurrentPpPadepense: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.pp_pa_depense = val;
            })
          );
        },
        setCurrentFreeTalentPoints: (val) => {
          set(
            produce((draftState) => {
              draftState.currentPerso.freeTalentPoints = val;
            })
          );
        },
        setCurrentPouvoirPaDepense(pouvoirId, val) {
          set(
            produce((draftState) => {
              draftState.currentPerso.pouvoirs[pouvoirId].pa_depense = val;
            })
          );
        },
        setCurrentPouvoir(pouvoirId, val) {
          set(
            produce((draftState) => {
              draftState.currentPerso.pouvoirs[pouvoirId] = val;
            })
          );
        },
        deleteCurrentPouvoir(pouvoirId) {
          set(
            produce((draftState) => {
              delete draftState.currentPerso.pouvoirs[pouvoirId];
            })
          );
        },
        setCurrentEquipement(equipementId, val) {
          set(
            produce((draftState) => {
              draftState.currentPerso.equipements[equipementId] = val;
            })
          );
        },
        deleteCurrentEquipement(equipementId) {
          set(
            produce((draftState) => {
              delete draftState.currentPerso.equipements[equipementId];
            })
          );
        },
      };
    },
    {
      name: "insmvassistantstorage",
    }
  )
);
