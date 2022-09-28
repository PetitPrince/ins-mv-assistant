import { BillingItem } from "../components/billing/Billing";
import { TalentDisplayRow } from "../components/talents/Talents";
import { CARACTERISTIQUE_NAMES } from "../utils/const/Caracteristiques_names";
import { FACTIONS_NAMES } from "../utils/const/Factions";
import { Personnage, TalentInvesti } from "../utils/const/Personnage";
import { Pouvoir } from "../utils/const/Pouvoir";
import {
  Talent2,
  TALENT_SPECIALISATION_TYPE_NAME,
  TALENT_TYPE_NAME,
} from "../utils/const/TalentStandard";
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
  talents2: {
    principaux: [
      {
        name: "Tir",
        id: "tir",
        associatedChara: CARACTERISTIQUE_NAMES.PERCEPTION,
        specialisationType: TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE,
        isInnate: true,
        talentType: TALENT_TYPE_NAME.PRINCIPALE,
        superieur_exotique: "",
        pa_depense: 4,
      },
      {
        name: "Tir    ",
        id: "tir_specifique",
        associatedChara: CARACTERISTIQUE_NAMES.PERCEPTION,
        specialisationType: TALENT_SPECIALISATION_TYPE_NAME.SPECIFIQUE,
        isInnate: true,
        talentType: TALENT_TYPE_NAME.PRINCIPALE,
        superieur_exotique: "",
        pa_depense: 6,
      },
      {
        specialisationType: TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE,
        name: "Torture",
        id: "torture",
        associatedChara: CARACTERISTIQUE_NAMES.AUCUNE,
        isInnate: false,
        superieur_exotique: "Joseph",
        talentType: TALENT_TYPE_NAME.EXOTIQUE,
        pa_depense: 8,
      },
      {
        specialisationType: TALENT_SPECIALISATION_TYPE_NAME.GENERIQUE,
        name: "Acrobatie   ",
        id: "acrobatie",
        associatedChara: CARACTERISTIQUE_NAMES.AGILITE,
        isInnate: false,
        superieur_exotique: "",
        talentType: TALENT_TYPE_NAME.SECONDAIRE,
        pa_depense: 4,
      },
    ],
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

  setCurrentTalentPrincipal2PaDepense: (talentId: string, val: number) => void;
  addCurrentTalentPrincipal2: (newTalent: Talent2) => void;
  setCurrentTalentPrincipal2NameFragment: (
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
  setCurrentPp: (val: number) => void;
  setCurrentPpMax: (val: number) => void;
  setCurrentFreeTalentPoints: (val: number) => void;
  setCurrentPouvoirPaDepense: (pouvoirId: string, val: number) => void;
  setCurrentPouvoir: (pouvoirId: string, val: Pouvoir) => void;
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

  setCurrentTalentPrincipal2PaDepense: (talentId: string, val: number) => {
    const updatedTalentPrincipalArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.principaux.findIndex(
        (talent: Talent2) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.principaux[index].pa_depense = val;
    });
    set(updatedTalentPrincipalArray);
  },

  setCurrentTalentPrincipal2NameFragment: (
    talentId: string,
    nameFragment: string
  ) => {
    console.log("-");
    console.log(talentId);
    console.log(nameFragment);
    const updatedTalentPrincipalArray = produce((draftState) => {
      const index = draftState.currentPerso.talents2.principaux.findIndex(
        (talent: Talent2) => talent.id === talentId
      );
      if (index !== -1)
        draftState.currentPerso.talents2.principaux[index].customNameFragment =
          nameFragment;
    });
    set(updatedTalentPrincipalArray);
  },

  addCurrentTalentPrincipal2: (newTalent: Talent2) => {
    set(
      produce((draftState) => {
        draftState.currentPerso.talents2.principaux.push(newTalent);
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
