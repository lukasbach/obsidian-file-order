import { TAbstractFile, TFolder } from "obsidian";
import React, { FC, useCallback, useMemo, useState } from "react";
import { DragBox } from "./dragBox";
import { sortByName } from "./utils";
import { FileOrderSettings } from "../common";

export interface ReorderDialogProps {
  parent?: TFolder;
  onComplete: (newItems: Array<{ item: TAbstractFile; name: string }>) => void;
  defaults: FileOrderSettings;
}

export const ReorderDialog: FC<ReorderDialogProps> = ({
  parent,
  onComplete,
  defaults,
}) => {
  const [newFolderOrder, setNewFolderOrder] =
    useState<Array<{ item: TAbstractFile; name: string }>>(null);
  const [newFileOrder, setNewFileOrder] =
    useState<Array<{ item: TAbstractFile; name: string }>>(null);
  const shouldInclude = useCallback(
    (item: TAbstractFile) => {
      if (defaults.ignoreFolderFile && item.name === `${item.parent.name}.md`) {
        return false;
      }

      return (
        defaults.ignorePattern === "" ||
        !item.name.match(defaults.ignorePattern)
      );
    },
    [defaults.ignoreFolderFile, defaults.ignorePattern]
  );
  const originalFolders = useMemo(
    () =>
      sortByName(
        parent.children.filter(
          (item) => item instanceof TFolder && shouldInclude(item)
        )
      ),
    [parent.children, shouldInclude]
  );
  const originalFiles = useMemo(
    () =>
      sortByName(
        parent.children.filter(
          (item) => !(item instanceof TFolder) && shouldInclude(item)
        )
      ),
    [parent.children, shouldInclude]
  );

  const onCompleteClick = useCallback(() => {
    onComplete([...newFolderOrder, ...newFileOrder]);
  }, [newFileOrder, newFolderOrder, onComplete]);

  return (
    <div className="file-order-dialog">
      <div className="file-order-dialog-content">
        <DragBox
          originalItems={originalFolders}
          onChange={setNewFolderOrder}
          title="Folders"
          defaults={defaults}
        />
        <DragBox
          originalItems={originalFiles}
          onChange={setNewFileOrder}
          title="Files"
          defaults={defaults}
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
