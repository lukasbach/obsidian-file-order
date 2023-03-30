import React, { FC, useId, useState } from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { FileItem } from "./fileItem";
import { FileOrderSettings } from "../common";
import { useDragBox } from "./useDragBox";
import { DropBoxConfig } from "./dropBoxConfig";

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
    currentItems,
    setCurrentItems,
    newNames,
    ...dropBoxConfigProps
  } = useDragBox(props);
  const [expanded, setExpanded] = useState(false);
  const dropId = useId();

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
      <DropBoxConfig expanded={expanded} {...dropBoxConfigProps} />
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
                  {/* eslint-disable-next-line no-shadow */}
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
