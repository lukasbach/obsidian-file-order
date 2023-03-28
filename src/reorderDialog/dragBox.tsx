import React, { FC, useEffect, useId, useState } from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FileItem } from "./fileItem";
import { inferOrderProperties } from "./utils";

export interface DragBoxProps {
  items: TAbstractFile[];
  originalItems: TAbstractFile[];
  newNames: string[];
  onChange: (newOrder: TAbstractFile[]) => void;
  delim: string;
  setDelim: (newValue: string) => void;
  prefixMinLength: number;
  setPrefixMinLength: (newValue: number) => void;
}

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragBox: FC<DragBoxProps> = ({
  items,
  onChange,
  newNames,
  originalItems,
  prefixMinLength,
  setPrefixMinLength,
  delim,
  setDelim,
}) => {
  const dropId = useId();

  useEffect(() => {
    const properties = inferOrderProperties(
      originalItems.map((item) => item.name)
    );
    if (properties) {
      setDelim(properties.delimiter);
      setPrefixMinLength(properties.prefixMinLength);
    }
  }, [originalItems, setDelim, setPrefixMinLength]);

  return (
    <>
      <div className="file-order-dialog-items-config">
        Items have a minimum of{" "}
        <input
          type="number"
          placeholder="123"
          style={{ width: "30px" }}
          value={prefixMinLength}
          onChange={(e) => {
            setPrefixMinLength(parseInt(e.target.value, 10));
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
        {delim === " " ? " (space)" : ""}.
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) {
            return;
          }
          onChange(
            reorder(items, result.source.index, result.destination.index)
          );
        }}
      >
        <Droppable droppableId={dropId}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
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
