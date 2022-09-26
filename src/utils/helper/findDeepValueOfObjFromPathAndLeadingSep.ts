export let findDeepValueOfObjFromPathAndLeadingSep = (
  obj: any,
  path: string,
  sep: string
) => {
  //@ts-ignore
  // eslint-disable-next-line
  for (var i = 1, path = path.split(sep), len = path.length; i < len; i++) {
    obj = obj[path[i]];
  }
  return obj;
};
