import React, {
  FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { VscChevronDown, VscChevronUp } from "react-icons/all";
import { FileItem } from "./fileItem";
import {
  computeNewNames,
  inferOrderProperties,
  obsidianCompareNames,
  parseItemName,
} from "./utils";

export interface DragBoxProps {
  originalItems: TAbstractFile[];
  onChange: (newOrder: Array<{ item: TAbstractFile; name: string }>) => void;
  title: string;
}

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragBox: FC<DragBoxProps> = ({
  onChange,
  originalItems,
  title,
}) => {
  const [currentItems, setCurrentItems] = useState(originalItems);
  const [originalDelim, setOriginalDelim] = useState("");
  const [originalPrefixLen, setOriginalPrefixLen] = useState(0);
  const [originalStartingIndex, setOriginalStartingIndex] = useState(0);
  const [delim, setDelim] = useState("");
  const [prefixLen, setPrefixLen] = useState(0);
  const [startingIndex, setStartingIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
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

  const dropId = useId();

  useEffect(() => {
    const properties = inferOrderProperties(
      originalItems.map((item) => item.name)
    );
    console.log("properties inferred", properties);
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

  const prefixLenId = useId();
  const delimiterId = useId();
  const startingIndexId = useId();

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
  const configElementRef = useRef<HTMLDivElement>(null);

  if (originalItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="file-order-dialog-h2-container">
        <h2 className="file-order-dialog-h2">{title}</h2>
        <button type="button" onClick={onUndoClick}>
          Undo Changes
        </button>
        <button type="button" onClick={clearCustomOrderingClick}>
          Clear custom ordering
        </button>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          title="More options"
        >
          {expanded ? <VscChevronUp /> : <VscChevronDown />}
        </button>
      </div>
      <div
        ref={configElementRef}
        className={[
          "file-order-dialog-items-config",
          expanded ? "file-order-expanded" : "file-order-hidden",
        ].join(" ")}
        style={{
          maxHeight: expanded ? configElementRef.current?.scrollHeight : 0,
        }}
      >
        <div className="file-order-field">
          <label htmlFor={prefixLenId}>Index Minimum Length</label>
          <input
            id={prefixLenId}
            type="number"
            min={0}
            placeholder="123"
            style={{ width: "30px" }}
            value={prefixLen}
            onChange={(e) => {
              setPrefixLen(parseInt(e.target.value, 10));
            }}
          />
        </div>

        <div
          className="file-order-field"
          title={
            delim.split("").every((c) => c === " ")
              ? `${delim.length} space${delim.length > 1 ? "s" : ""}`
              : ""
          }
        >
          <label htmlFor={delimiterId}>Delimiter</label>
          <input
            id={delimiterId}
            type="text"
            placeholder="x"
            style={{ width: "40px" }}
            value={delim}
            onChange={(e) => {
              setDelim(e.target.value);
            }}
          />
        </div>

        <div className="file-order-field">
          <label htmlFor={startingIndexId}>Starting Index</label>
          <input
            id={startingIndexId}
            type="number"
            placeholder="0"
            style={{ width: "30px" }}
            value={startingIndex}
            onChange={(e) => {
              setStartingIndex(parseInt(e.target.value, 10));
            }}
          />
        </div>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) {
            return;
          }
          setCurrentItems(
            reorder(currentItems, result.source.index, result.destination.index)
          );
        }}
      >
        <Droppable droppableId={dropId}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {currentItems.map((item, index) => (
                <Draggable
                  key={item.name}
                  draggableId={item.name}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={
                        snapshot.isDragging ? "file-order-dragging" : ""
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <FileItem
                        file={item}
                        isFolder={item instanceof TFolder}
                        newName={newNames[index]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
