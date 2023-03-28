import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeNewNames,
  inferOrderProperties,
  obsidianCompareNames,
  parseItemName,
} from "./utils";
import { DragBoxProps } from "./dragBox";

export const useDragBox = ({
  originalItems,
  defaults,
  onChange,
}: DragBoxProps) => {
  const [currentItems, setCurrentItems] = useState(originalItems);
  const [originalDelim, setOriginalDelim] = useState(defaults.delimiter);
  const [originalPrefixLen, setOriginalPrefixLen] = useState(
    defaults.prefixMinLength
  );
  const [originalStartingIndex, setOriginalStartingIndex] = useState(
    defaults.startingIndex
  );
  const [delim, setDelim] = useState(defaults.delimiter);
  const [prefixLen, setPrefixLen] = useState(defaults.prefixMinLength);
  const [startingIndex, setStartingIndex] = useState(defaults.startingIndex);
  const newNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalItems.map((item) => item.name),
        newOrder: currentItems.map((item) => item.name),
        delimiter: delim,
        prefixMinLength: prefixLen,
        originalDelimiter: originalDelim,
        originalPrefixMinLength: originalPrefixLen,
        startingIndex,
      }),
    [
      currentItems,
      delim,
      originalDelim,
      originalItems,
      originalPrefixLen,
      prefixLen,
      startingIndex,
    ]
  );

  useEffect(() => {
    const properties = inferOrderProperties(
      originalItems.map((item) => item.name)
    );
    if (properties) {
      setDelim(properties.delimiter);
      setOriginalDelim(properties.delimiter);
      setPrefixLen(properties.prefixMinLength);
      setOriginalPrefixLen(properties.prefixMinLength);
      setStartingIndex(properties.startingIndex);
      setOriginalStartingIndex(properties.startingIndex);
    }
  }, [originalItems]);

  useEffect(() => {
    const newItems = currentItems
      .map((item, index) => ({
        item,
        name: newNames[index],
      }))
      .filter(({ name, item }) => name !== item.name);
    onChange(newItems);
  }, [currentItems, newNames, onChange]);

  const onUndoClick = useCallback(() => {
    setCurrentItems(originalItems);
    setDelim(originalDelim);
    setPrefixLen(originalPrefixLen);
    setStartingIndex(originalStartingIndex);
  }, [originalDelim, originalItems, originalPrefixLen, originalStartingIndex]);

  const clearCustomOrderingClick = useCallback(() => {
    setPrefixLen(0);
    const items = [...currentItems];
    items.sort((a, b) =>
      obsidianCompareNames(
        parseItemName(a.name, delim),
        parseItemName(b.name, delim)
      )
    );
    setCurrentItems(items);
  }, [currentItems, delim]);

  return {
    onUndoClick,
    clearCustomOrderingClick,
    prefixLen,
    setPrefixLen,
    delim,
    setDelim,
    startingIndex,
    setStartingIndex,
    currentItems,
    setCurrentItems,
    newNames,
  };
};
