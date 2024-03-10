export interface FileOrderSettings {
  delimiter: string;
  prefixMinLength: number;
  startingIndex: number;
  ignorePattern: string;
  ignoreFolderFile: boolean;
}
export const DEFAULT_SETTINGS: FileOrderSettings = {
  delimiter: " ",
  prefixMinLength: 0,
  startingIndex: 0,
  ignorePattern: "",
  ignoreFolderFile: false,
};
