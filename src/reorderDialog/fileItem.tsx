import React, { FC } from "react";
import { TAbstractFile } from "obsidian";
import {
  VscEdit,
  VscFile,
  VscFolder,
  VscGripper,
  VscMenu,
} from "react-icons/all";

interface FileItemProps {
  file: TAbstractFile;
  originalOrder: TAbstractFile[];
  currentOrder: TAbstractFile[];
  index: number;
  isFolder: boolean;
  newName: string;
}

export const FileItem: FC<FileItemProps> = ({ file, isFolder, newName }) => {
  return (
    <div className={`file-order-item`}>
      <div className="file-order-item-dragicon">
        <VscGripper />
      </div>
      <div className="file-order-item-itemicon">
        {isFolder ? <VscFolder /> : <VscFile />}
      </div>
      <div className="file-order-item-name">{newName}</div>
      {newName !== file.name && (
        <div className="file-order-item-changedicon">
          <VscEdit />
        </div>
      )}
    </div>
  );
};
