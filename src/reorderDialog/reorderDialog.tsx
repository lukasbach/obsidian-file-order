import { TFolder } from "obsidian";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FileOrder } from "../fileOrder";
import { DragBox } from "./dragBox";
import { computeNewNames, sortByName } from "./computeNewNames";

interface ReorderDialogProps {
  plugin: FileOrder;
  parent?: TFolder;
}

export const ReorderDialog: FC<ReorderDialogProps> = ({ parent, plugin }) => {
  const originalFolders = useMemo(
    () => sortByName(parent.children.filter((item) => item instanceof TFolder)),
    [parent]
  );
  const [currentFolders, setCurrentFolders] = useState(originalFolders);
  const newFolderNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalFolders.map((item) => item.name),
        newOrder: currentFolders.map((item) => item.name),
        delimiter: " ",
        prefixMinLength: 0,
      }),
    [currentFolders, originalFolders]
  );

  const originalFiles = useMemo(
    () =>
      sortByName(parent.children.filter((item) => !(item instanceof TFolder))),
    [parent]
  );
  const [currentFiles, setCurrentFiles] = useState(originalFiles);
  const newFileNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalFiles.map((item) => item.name),
        newOrder: currentFiles.map((item) => item.name),
        delimiter: " ",
        prefixMinLength: 0,
      }),
    [currentFiles, originalFiles]
  );

  return (
    <div style={{ height: "700px" }}>
      <h2>Folders</h2>
      <DragBox
        items={currentFolders}
        originalItems={originalFolders}
        onChange={setCurrentFolders}
        newNames={newFolderNames}
      />
      <h2>Files</h2>
      <DragBox
        items={currentFiles}
        originalItems={originalFiles}
        onChange={setCurrentFiles}
        newNames={newFileNames}
      />
    </div>
  );
};
