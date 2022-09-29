import { BillingItem } from "../components/billing/Billing";
import { CARACTERISTIQUE_NAMES } from "../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../utils/const/Factions";
import { Personnage } from "../utils/const/Personnage";
import { Pouvoir } from "../utils/const/Pouvoir";
import { Talent } from "../utils/const/TalentStandard";
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
      pa_depense: 6,
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
  pp_pa_depense: 0,
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
  talents2: {
    principaux: [],
    secondaires: [],
    exotiques: [],
  },
  pouvoirs: {},
};
// export const emptyPerso = new Personnage(emptyPersoDict);
export const emptyPerso = emptyPersoDict;

export const useStore = create<{
  currentPerso: Personnage;
  originalPerso: Personnage;
  billingItems: BillingItem[];
  paAfterBilling: number;

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
}>((set, get) => ({
  currentPerso: emptyPerso,
  originalPerso: emptyPerso,
  billingItems: [],
  paAfterBilling: 0,

  setCurrentTalentPrincipalPaDepense: (talentId: string, val: number) => {
    const updatedTalentPrincipalArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.principaux.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.principaux[index].pa_depense = val;
    });
    set(updatedTalentPrincipalArray);
  },

  setCurrentTalentPrincipalNameFragment: (
    talentId: string,
    nameFragment: string
  ) => {
    const updatedTalentPrincipalArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.principaux.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.principaux[index].customNameFragment =
          nameFragment;
    });
    set(updatedTalentPrincipalArray);
  },

  addCurrentTalentPrincipal: (newTalent: Talent) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents2.principaux.push(newTalent);
      })
    );
  },
  setCurrentTalentSecondairePaDepense: (talentId: string, val: number) => {
    const updatedTalentSecondaireArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.secondaires.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.secondaires[index].pa_depense = val;
    });
    set(updatedTalentSecondaireArray);
  },

  setCurrentTalentSecondaireNameFragment: (
    talentId: string,
    nameFragment: string
  ) => {
    const updatedTalentSecondaireArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.secondaires.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.secondaires[index].customNameFragment =
          nameFragment;
    });
    set(updatedTalentSecondaireArray);
  },

  addCurrentTalentSecondaire: (newTalent: Talent) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents2.secondaires.push(newTalent);
      })
    );
  },

  setCurrentTalentExotiquePaDepense: (talentId: string, val: number) => {
    const updatedTalentExotiqueArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.exotiques.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.exotiques[index].pa_depense = val;
    });
    set(updatedTalentExotiqueArray);
  },

  setCurrentTalentExotiqueNameFragment: (
    talentId: string,
    nameFragment: string
  ) => {
    const updatedTalentExotiqueArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.exotiques.findIndex(
        (talent: Talent) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.exotiques[index].customNameFragment =
          nameFragment;
    });
    set(updatedTalentExotiqueArray);
  },

  addCurrentTalentExotique: (newTalent: Talent) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents2.exotiques.push(newTalent);
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
}));
