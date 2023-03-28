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
  const originalFolders = useMemo(
    () => sortByName(parent.children.filter((item) => item instanceof TFolder)),
    [parent]
  );
  const [currentFolders, setCurrentFolders] = useState(originalFolders);
  const [folderDelim, setFolderDelim] = useState("");
  const [folderPrefixLen, setFolderPrefixLen] = useState(0);
  const newFolderNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalFolders.map((item) => item.name),
        newOrder: currentFolders.map((item) => item.name),
        delimiter: folderDelim,
        prefixMinLength: folderPrefixLen,
      }),
    [currentFolders, folderDelim, folderPrefixLen, originalFolders]
  );

  const originalFiles = useMemo(
    () =>
      sortByName(parent.children.filter((item) => !(item instanceof TFolder))),
    [parent]
  );
  const [currentFiles, setCurrentFiles] = useState(originalFiles);
  const [fileDelim, setFileDelim] = useState("");
  const [filePrefixLen, setFilePrefixLen] = useState(0);
  const newFileNames = useMemo(
    () =>
      computeNewNames({
        originalItems: originalFiles.map((item) => item.name),
        newOrder: currentFiles.map((item) => item.name),
        delimiter: fileDelim,
        prefixMinLength: filePrefixLen,
      }),
    [currentFiles, fileDelim, filePrefixLen, originalFiles]
  );

  const onCompleteClick = useCallback(() => {
    const allItems = [...currentFolders, ...currentFiles];
    const newNames = [...newFolderNames, ...newFileNames];
    const newItems = allItems
      .map((item, index) => ({
        item,
        name: newNames[index],
      }))
      .filter(({ name, item }) => name !== item.name);
    onComplete(newItems);
  }, [onComplete, currentFolders, currentFiles, newFolderNames, newFileNames]);

  const onUndoClick = useCallback(() => {
    setCurrentFiles(originalFiles);
    setCurrentFolders(originalFolders);
  }, [originalFiles, originalFolders]);

  const clearCustomOrderingClick = useCallback(() => {}, []);

  return (
    <div className="file-order-dialog">
      <div className="file-order-dialog-row">
        <button type="button" onClick={onUndoClick}>
          Undo Changes
        </button>
        <button type="button" onClick={clearCustomOrderingClick}>
          Clear custom ordering
        </button>
        <div className="file-order-dialog-row-grow" />
        <button type="button" className="mod-cta" onClick={onCompleteClick}>
          Apply changes
        </button>
      </div>
      <div className="file-order-dialog-content">
        {currentFolders.length > 0 && (
          <>
            <h2 className="file-order-dialog-h2">Folders</h2>
            <DragBox
              items={currentFolders}
              originalItems={originalFolders}
              onChange={setCurrentFolders}
              newNames={newFolderNames}
              delim={folderDelim}
              setDelim={setFolderDelim}
              prefixMinLength={folderPrefixLen}
              setPrefixMinLength={setFolderPrefixLen}
            />
          </>
        )}
        {currentFiles.length > 0 && (
          <>
            <h2 className="file-order-dialog-h2">Files</h2>
            <DragBox
              items={currentFiles}
              originalItems={originalFiles}
              onChange={setCurrentFiles}
              newNames={newFileNames}
              delim={fileDelim}
              setDelim={setFileDelim}
              prefixMinLength={filePrefixLen}
              setPrefixMinLength={setFilePrefixLen}
            />
          </>
        )}
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
