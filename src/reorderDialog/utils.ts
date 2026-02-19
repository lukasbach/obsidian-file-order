import { TAbstractFile } from "obsidian";

const parseItemNamePieces = (fileName: string, delimiter: string) => {
  if (fileName.match(new RegExp(`^\\d+${delimiter}`))) {
    const index = /^(\d+)/.exec(fileName)![1];
    const numberLength = index.length;
    return {
      index: parseInt(index, 10),
      name: fileName.slice(numberLength + delimiter.length),
    };
  }
  return null;
};

export const parseItemName = (fileName: string, delimiter: string) => {
  const parsed = parseItemNamePieces(fileName, delimiter);
  if (parsed) {
    return parsed.name;
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

export const obsidianCompareNames = (
  a: string | TAbstractFile,
  b: string | TAbstractFile
) => {
  const aName = a instanceof TAbstractFile ? a.name : a;
  const bName = b instanceof TAbstractFile ? b.name : b;
  //return aName.localeCompare(bName);
  var collator = new Intl.Collator([], {numeric: true});
  return collator.compare(aName, bName);
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
  originalPrefixMinLength: number;
  originalDelimiter: string;
  startingIndex: number;
}) => {
  const siblingsOriginalOrder = sortByName(
    opts.originalItems.map((item) =>
      parseItemName(item, opts.originalDelimiter)
    )
  );

  const newOrder = opts.newOrder.map((item) =>
    parseItemName(item, opts.originalDelimiter)
  );

  const areIdentical = siblingsOriginalOrder.reduce(
    (acc, item, index) => acc && item === newOrder[index],
    true
  );

  if (opts.prefixMinLength === 0 && areIdentical) {
    return siblingsOriginalOrder;
  }

  return newOrder.map((item, index) =>
    generateItemName(
      item,
      index + opts.startingIndex,
      opts.delimiter,
      Math.max(opts.prefixMinLength, `${newOrder.length}`.length)
    )
  );
};

export const inferOrderProperties = (items: string[]) => {
  if (items.length === 0) {
    return null;
  }

  const isOrdered = items.every((item) => item.match(/^\d+/));
  if (!isOrdered) {
    return null;
  }
  const numberLength = /^(\d+)/.exec(items[0])![1].length;
  const isActualPrefixLength = items.every((item) =>
    item.match(new RegExp(`^\\d{${String(items.length).length}}[^\\d]`))
  );

  let delimiter = "";
  for (let i = numberLength; i < items[0].length; i++) {
    const char = items[0][i];
    if (items.every((item) => item[i] === char)) {
      delimiter += char;
    } else {
      break;
    }
  }

  const lowestIndex = items
    .map((item) => parseInt(item.slice(0, numberLength), 10))
    .reduce((acc, item) => Math.min(acc, item), Number.MAX_SAFE_INTEGER);

  return {
    prefixMinLength: !isActualPrefixLength ? numberLength : 0,
    delimiter,
    startingIndex: lowestIndex,
  };
};

export const tryToGetFixedName = (
  items: string[] | undefined,
  brokenName: string
) => {
  if (!items) {
    return null;
  }

  const properties = inferOrderProperties(
    items.filter((i) => i !== brokenName)
  );
  if (!properties) {
    return null;
  }

  const namePieces = parseItemNamePieces(brokenName, properties.delimiter);
  if (!namePieces) {
    return generateItemName(
      parseItemName(brokenName, properties.delimiter),
      items.length + properties.startingIndex,
      properties.delimiter,
      Math.max(properties.prefixMinLength, `${items.length}`.length)
    );
  }

  return null;
};
