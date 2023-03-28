import React, { FC, useEffect, useId, useMemo, useState } from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FileItem } from "./fileItem";
import { computeNewNames, inferOrderProperties } from "./utils";

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
  const [delim, setDelim] = useState("");
  const [prefixLen, setPrefixLen] = useState(0);
  const newNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalItems.map((item) => item.name),
        newOrder: currentItems.map((item) => item.name),
        delimiter: delim,
        prefixMinLength: prefixLen,
        originalDelimiter: originalDelim,
        originalPrefixMinLength: originalPrefixLen,
      }),
    [
      currentItems,
      delim,
      originalDelim,
      originalItems,
      originalPrefixLen,
      prefixLen,
    ]
  );

  const dropId = useId();

  useEffect(() => {
    const properties = inferOrderProperties(
      originalItems.map((item) => item.name)
    );
    console.log("inferred properties", properties);
    if (properties) {
      setDelim(properties.delimiter);
      setOriginalDelim(properties.delimiter);
      setPrefixLen(properties.prefixMinLength);
      setOriginalPrefixLen(properties.prefixMinLength);
    }
  }, [originalItems, setDelim, setPrefixLen]);

  useEffect(() => {
    const newItems = currentItems
      .map((item, index) => ({
        item,
        name: newNames[index],
      }))
      .filter(({ name, item }) => name !== item.name);
    onChange(newItems);
  }, [currentItems, newNames, onChange]);

  if (originalItems.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="file-order-dialog-h2">{title}</h2>
      <div className="file-order-dialog-items-config">
        Items have a minimum of{" "}
        <input
          type="number"
          placeholder="123"
          style={{ width: "30px" }}
          value={prefixLen}
          onChange={(e) => {
            setPrefixLen(parseInt(e.target.value, 10));
          }}
        />{" "}
        numbers, seperated from the filename by a{" "}
        <input
          type="text"
          placeholder="xx"
          style={{ width: "40px" }}
          value={delim}
          onChange={(e) => {
            setDelim(e.target.value);
          }}
        />
        {delim === " " ? " (space)" : ""}. Index starts at
        <input type="number" placeholder="123" style={{ width: "30px" }} />.
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
