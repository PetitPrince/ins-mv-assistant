import { Talent2 } from "../../utils/const/TalentStandard";

export const alphaSort = (a: Talent2, b: Talent2): 0 | 1 | -1 => {
  let fa = a.id.toLowerCase(),
    fb = b.id.toLowerCase();

  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
};
