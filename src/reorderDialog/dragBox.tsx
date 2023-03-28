import React, { FC, useId, useRef, useState } from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { VscChevronDown, VscChevronUp } from "react-icons/all";
import { FileItem } from "./fileItem";
import { FileOrderSettings } from "../common";
import { useDragBox } from "./useDragBox";

export interface DragBoxProps {
  originalItems: TAbstractFile[];
  onChange: (newOrder: Array<{ item: TAbstractFile; name: string }>) => void;
  title: string;
  defaults: FileOrderSettings;
}

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragBox: FC<DragBoxProps> = (props) => {
  const { originalItems, title } = props;
  const {
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
  } = useDragBox(props);
  const dropId = useId();
  const configElementRef = useRef<HTMLDivElement>(null);

  const prefixLenId = useId();
  const delimiterId = useId();
  const startingIndexId = useId();
  const [expanded, setExpanded] = useState(false);

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
