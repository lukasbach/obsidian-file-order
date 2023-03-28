import { Notice, Plugin, TFile, TFolder } from "obsidian";
import { FileOrderSettingTab } from "./fileOrderSettingTab";
import { DEFAULT_SETTINGS, FileOrderSettings } from "./common";
import { ReorderModal } from "./reorderModal";

export class FileOrder extends Plugin {
  settings: FileOrderSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new FileOrderSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle("Reorder items")
            .setIcon("arrow-up-down")
            .onClick(async () => {
              const fileItem = file ?? this.app.vault.getRoot();
              const parent = (
                fileItem instanceof TFile ? fileItem.parent : fileItem
              ) as TFolder;
              new ReorderModal(this, parent).open();
            });
        });
      })
    );
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
