import React, { FC, useId } from "react";
import { TAbstractFile, TFolder } from "obsidian";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FileItem } from "./fileItem";

export interface DragBoxProps {
  items: TAbstractFile[];
  originalItems: TAbstractFile[];
  newNames: string[];
  onChange: (newOrder: TAbstractFile[]) => void;
}

const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragBox: FC<DragBoxProps> = ({ items, onChange, newNames }) => {
  const dropId = useId();
  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) {
          return;
        }
        onChange(reorder(items, result.source.index, result.destination.index));
      }}
    >
      <Droppable droppableId={dropId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.name} draggableId={item.name} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={snapshot.isDragging ? "file-order-dragging" : ""}
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
  );
};
