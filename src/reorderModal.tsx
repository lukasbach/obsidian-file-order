import { Modal, TFolder } from "obsidian";
import ReactDOM from "react-dom/client";
import React from "react";
import { FileOrder } from "./fileOrder";
import { ReorderDialog } from "./reorderDialog/reorderDialog";

export class ReorderModal extends Modal {
  constructor(private plugin: FileOrder, private parent?: TFolder) {
    super(plugin.app);
    const root = ReactDOM.createRoot(this.contentEl);
    this.titleEl.innerHTML = `Reorder Files of ${parent.path}`;
    root.render(<ReorderDialog plugin={plugin} parent={parent} />);
  }
}
