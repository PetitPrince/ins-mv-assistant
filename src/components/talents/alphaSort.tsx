import { Talent } from "../../utils/const/TalentStandard";

export const alphaSort = (a: Talent, b: Talent): 0 | 1 | -1 => {
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
