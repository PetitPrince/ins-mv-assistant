import { BillingItem } from "../components/billing/Billing";
import { TalentDisplayRow } from "../components/talents/Talents";
import { CARACTERISTIQUE_NAMES } from "../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../utils/const/Factions";
import { Personnage, TalentInvesti } from "../utils/const/Personnage";
import produce from "immer";
import create from "zustand";

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
  paTotal: 0,
  pp: 0,
  ppMax: 0,
  talents: {
    principaux: {
      // "combat-specifique": {
      //   niveau: 4,
      //   customNameFragment: "Crayon très aiguisé"
      // },
      // "baratin": {
      //   niveau: 3
      // }
    },
    secondaires: {
      // "aisance-sociale": {
      //   niveau: 3
      // },
      // "hobby-dressage-de-bouquetin": {
      //   customNameFragment: "Dressage de bouquetin",
      //   niveau: 4
      // }
    },
    exotiques: {},
  },
};
// export const emptyPerso = new Personnage(emptyPersoDict);
export const emptyPerso = emptyPersoDict;

export const useStore = create<{
  currentPerso: Personnage;
  originalPerso: Personnage;
  billingItems: BillingItem[];
  paAfterBilling: number;

  setPerso: (val: Personnage) => void;
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
  setCurrentPp: (val: number) => void;
  setCurrentPpMax: (val: number) => void;
  setCurrentFreeTalentPoints: (val: number) => void;
  setCurrentTalentPrincipal: (talentId: string, val: TalentInvesti) => void;
  setCurrentTalentPrincipalPaDepense: (talentId: string, val: number) => void;
  setCurrentTalentPrincipalNameFragment: (
    talentId: string,
    val: string
  ) => void;
  setCurrentTalentSecondaire: (talentId: string, val: TalentInvesti) => void;
  setCurrentTalentSecondairePaDepense: (talentId: string, val: number) => void;
  setCurrentTalentSecondaireNameFragment: (
    talentId: string,
    val: string
  ) => void;
  setCurrentTalentExotique: (talentId: string, val: TalentDisplayRow) => void;
  setCurrentTalentExotiquePaDepense: (talentId: string, val: number) => void;
}>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,

  setPerso: (val) => {
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
    set(
      produce((draftState) => {
        draftState.currentPerso.identite = val;
      })
    );
  },
  setCurrentFaction: (val) => {
    console.log(val);
    set(
      produce((draftState) => {
        draftState.currentPerso.faction = val;
      })
    );
  },
  setCurrentGrade: (val) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.grade = val;
      })
    );
  },
  setCurrentSuperieur: (val) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.superieur = val;
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
  setCurrentPp: (val) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.pp = val;
      })
    );
  },
  setCurrentPpMax: (val) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.ppMax = val;
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
  setCurrentTalentPrincipal(talentId, val) {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents.principaux[talentId] = val;
      })
    );
  },
  setCurrentTalentPrincipalPaDepense(talentId, val) {
    const hasTalent = Object.keys(
      get().currentPerso.talents.principaux
    ).includes(talentId);
    if (hasTalent) {
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.principaux[talentId].pa_depense = val;
        })
      );
    } else {
      const newTalent: TalentInvesti = {
        pa_depense: val,
        niveau: 1,
      };
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.principaux[talentId] = newTalent;
        })
      );
    }
  },

  setCurrentTalentPrincipalNameFragment(talentId, val) {
    const hasTalent = Object.keys(
      get().currentPerso.talents.principaux
    ).includes(talentId);
    if (hasTalent) {
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.principaux[
            talentId
          ].customNameFragment = val;
        })
      );
    } else {
      const newTalent: TalentInvesti = {
        pa_depense: 0,
        niveau: 1,
        customNameFragment: val,
      };
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.principaux[talentId] = newTalent;
        })
      );
    }
  },
  setCurrentTalentSecondaire(talentId, val) {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents.secondaires[talentId] = val;
      })
    );
  },
  setCurrentTalentSecondairePaDepense(talentId, val) {
    const hasTalent = Object.keys(
      get().currentPerso.talents.secondaires
    ).includes(talentId);
    if (hasTalent) {
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.secondaires[talentId].pa_depense =
            val;
        })
      );
    } else {
      const newTalent: TalentInvesti = {
        pa_depense: val,
        niveau: 1,
      };
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.secondaires[talentId] = newTalent;
        })
      );
    }
  },

  setCurrentTalentSecondaireNameFragment(talentId, val) {
    const hasTalent = Object.keys(
      get().currentPerso.talents.secondaires
    ).includes(talentId);
    if (hasTalent) {
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.secondaires[
            talentId
          ].customNameFragment = val;
        })
      );
    } else {
      const newTalent: TalentInvesti = {
        pa_depense: 0,
        niveau: 1,
        customNameFragment: val,
      };
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.secondaires[talentId] = newTalent;
        })
      );
    }
  },

  setCurrentTalentExotique(talentId, val) {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents.exotiques[talentId] = val;
      })
    );
  },
  setCurrentTalentExotiquePaDepense(talentId, val) {
    const hasTalent = Object.keys(
      get().currentPerso.talents.exotiques
    ).includes(talentId);
    if (hasTalent) {
      set(
        produce((draftState) => {
          draftState.currentPerso.talents.exotiques[talentId].pa_depense = val;
        })
      );
    } else {
      console.log("Cannot find talent with " + talentId);
    }
  },
}));
