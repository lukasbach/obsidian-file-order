import { TAbstractFile, TFolder } from "obsidian";
import React, { FC, useCallback, useMemo, useState } from "react";
import { DragBox } from "./dragBox";
import { computeNewNames, sortByName } from "./utils";

export interface ReorderDialogProps {
  parent?: TFolder;
  onComplete: (newItems: Array<{ item: TAbstractFile; name: string }>) => void;
}

export const ReorderDialog: FC<ReorderDialogProps> = ({
  parent,
  onComplete,
}) => {
  const [newFolderOrder, setNewFolderOrder] =
    useState<Array<{ item: TAbstractFile; name: string }>>(null);
  const [newFileOrder, setNewFileOrder] =
    useState<Array<{ item: TAbstractFile; name: string }>>(null);
  const originalFolders = useMemo(
    () => sortByName(parent.children.filter((item) => item instanceof TFolder)),
    [parent]
  );
  const originalFiles = useMemo(
    () =>
      sortByName(parent.children.filter((item) => !(item instanceof TFolder))),
    [parent]
  );

  const onCompleteClick = useCallback(() => {
    onComplete([...newFolderOrder, ...newFileOrder]);
  }, [newFileOrder, newFolderOrder, onComplete]);

  return (
    <div className="file-order-dialog">
      <div className="file-order-dialog-row">
        <div className="file-order-dialog-row-grow" />
        <button type="button" className="mod-cta" onClick={onCompleteClick}>
          Apply changes
        </button>
      </div>
      <div className="file-order-dialog-content">
        <DragBox
          originalItems={originalFolders}
          onChange={setNewFolderOrder}
          title="Folders"
        />
        <DragBox
          originalItems={originalFiles}
          onChange={setNewFileOrder}
          title="Files"
        />
      </div>
      <div className="file-order-dialog-row">
        <div className="file-order-dialog-row-grow" />
        <button type="button" className="mod-cta" onClick={onCompleteClick}>
          Apply changes
        </button>
      </div>
    </div>
  );
};
