import { Notice, Plugin, TFile, TFolder } from "obsidian";
import { FileOrderSettingTab } from "./fileOrderSettingTab";
import { DEFAULT_SETTINGS, FileOrderSettings } from "./common";
import { ReorderModal } from "./reorderModal";
import { tryToGetFixedName } from "./reorderDialog/utils";

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

        const fixedName = tryToGetFixedName(
          file.parent?.children.map((i) => i.name),
          file.name
        );

        if (fixedName) {
          menu.addItem((item) => {
            item
              .setTitle("Fix name to ordering convention")
              .setIcon("check")
              .onClick(async () => {
                await this.app.fileManager.renameFile(
                  file,
                  `${file.parent.path}/${fixedName}`
                );
                new Notice(`Fixed name to: "${fixedName}"`);
              });
          });
        }
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
