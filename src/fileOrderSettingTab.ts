import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { FileOrder } from "./fileOrder";

export class FileOrderSettingTab extends PluginSettingTab {
  plugin: FileOrder;

  constructor(app: App, plugin: FileOrder) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "File Order default config" });
    containerEl.createEl("p", {
      text:
        "To reorder files, right click on any file in the file explorer, and " +
        'click on "Reorder items".',
    });
    containerEl.createEl("p", {
      text:
        "The following settings are defaults for when items are reordered for the first " +
        "time in a folder. Subsequent reorders will always reuse the existing settings for " +
        "the respective folder, and the settings can be changed per folder by clicking the " +
        'down-icon-button in the reorder view next to the "Files" or "Folders" headers.',
    });

    new Setting(containerEl)
      .setName("Prefix number minimum length")
      .setDesc(
        "Prefix numbers will be padded to that length if they are shorted, i.e. 001 instead of 1"
      )
      .addText((text) =>
        text
          .setValue(`${this.plugin.settings.prefixMinLength}`)
          .onChange(async (value) => {
            const parsedValue = parseInt(value, 10);
            if (Number.isNaN(parsedValue) || parsedValue < 0) {
              new Notice(
                "Prefix min length must be a number above or equal zero."
              );
              text.setValue(`${this.plugin.settings.prefixMinLength}`);
              return;
            }
            this.plugin.settings.prefixMinLength = parseInt(value, 10);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Delimiter")
      .setDesc(
        "Delimiter between prefix number and title. May be multiple characters."
      )
      .addText((text) => {
        text.setValue(this.getDelLabel()).onChange(async (value) => {
          if (value.startsWith("[")) {
            return;
          }
          this.plugin.settings.delimiter = value;
          await this.plugin.saveSettings();
        });
        // eslint-disable-next-line no-param-reassign
        text.inputEl.onfocus = () => {
          text.setValue(this.plugin.settings.delimiter);
        };
        // eslint-disable-next-line no-param-reassign
        text.inputEl.onblur = () => {
          text.setValue(this.getDelLabel());
        };
      });

    new Setting(containerEl)
      .setName("Starting Index")
      .setDesc("Starting index for prefix numbers.")
      .addText((text) =>
        text
          .setValue(`${this.plugin.settings.startingIndex}`)
          .onChange(async (value) => {
            const parsedValue = parseInt(value, 10);
            if (Number.isNaN(parsedValue) || parsedValue < 0) {
              new Notice(
                "Starting index must be a number above or equal zero."
              );
              text.setValue(`${this.plugin.settings.startingIndex}`);
              return;
            }
            this.plugin.settings.startingIndex = parseInt(value, 10);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Ignore Pattern")
      .setDesc(
        "RegEx of files and folder to ignore. Eg: ^index\\.md$ to ignore index.md files"
      )
      .addText((text) => {
        text
          .setValue(this.plugin.settings.ignorePattern)
          .onChange(async (value) => {
            this.plugin.settings.ignorePattern = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Ignore folder file")
      .setDesc("In a folder named MyFolderName, ignore MyFolderName.md")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.ignoreFolderFile)
          .onChange(async (value) => {
            this.plugin.settings.ignoreFolderFile = value;
            await this.plugin.saveSettings();
          });
      });
  }

  getDelLabel() {
    const currentValue = this.plugin.settings.delimiter;
    if (currentValue.split("").every((c) => c === " ")) {
      return `[${currentValue.length} space${
        currentValue.length > 1 ? "s" : ""
      }]`;
    }
    return currentValue;
  }
}
