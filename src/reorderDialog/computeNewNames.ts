import { TAbstractFile } from "obsidian";

const parseItemName = (fileName: string, delimiter: string) => {
  if (fileName.match(new RegExp(`^\\d+${delimiter}`))) {
    const [, ...rest] = fileName.split(delimiter);
    return rest.join(delimiter);
  }
  return fileName;
};

const generateItemName = (
  fileName: string,
  index: number,
  delimiter: string,
  prefixMinLength: number
) => {
  const prefix = index.toString().padStart(prefixMinLength, "0");
  return `${prefix}${delimiter}${fileName}`;
};

const obsidianCompareNames = (
  a: string | TAbstractFile,
  b: string | TAbstractFile
) => {
  const aName = a instanceof TAbstractFile ? a.name : a;
  const bName = b instanceof TAbstractFile ? b.name : b;
  return aName.localeCompare(bName);
  /*
  const specialCharsOrder = ["_", "-", ",", ";", "!", "`", "+", "=", "~"];
  const startsWithSpecial = (str: string) =>
    specialCharsOrder.some((c) => str.startsWith(c));
  if (startsWithSpecial(a) && !startsWithSpecial(b)) {
    return 1;
  }
  if (!startsWithSpecial(a) && startsWithSpecial(b)) {
    return -1;
  }
  if (startsWithSpecial(a) && startsWithSpecial(b)) {
    return specialCharsOrder.indexOf(b[0]) - specialCharsOrder.indexOf(a[0]);
  }
  return a.toLowerCase().localeCompare(b.toLowerCase()); */
};

export const sortByName = <T extends string | TAbstractFile>(items: T[]) => {
  const sorted = [...items];
  sorted.sort(obsidianCompareNames);
  return sorted;
};

export const computeNewNames = (opts: {
  originalItems: string[];
  newOrder: string[];
  prefixMinLength: number;
  delimiter: string;
}) => {
  const siblingsOriginalOrder = sortByName(
    opts.originalItems.map((item) => parseItemName(item, opts.delimiter))
  );

  const newOrder = opts.newOrder.map((item) =>
    parseItemName(item, opts.delimiter)
  );

  const areIdentical = siblingsOriginalOrder.reduce(
    (acc, item, index) => acc && item === newOrder[index],
    true
  );

  console.log(siblingsOriginalOrder, newOrder);
  if (opts.prefixMinLength === 0 && areIdentical) {
    console.log("Lists are identical");
    return siblingsOriginalOrder;
  }

  const newNames = newOrder.map((item, index) =>
    generateItemName(
      item,
      index,
      opts.delimiter,
      Math.max(opts.prefixMinLength, `${newOrder.length}`.length)
    )
  );

  console.log("new names are", newNames);

  return newNames;
};
