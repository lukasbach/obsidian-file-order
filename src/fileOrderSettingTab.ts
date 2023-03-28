import { App, PluginSettingTab, Setting } from "obsidian";
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
    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });
    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async (value) => {
            console.log(`Secret: ${value}`);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
