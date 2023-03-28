export interface FileOrderSettings {
  delimiter: string;
  prefixMinLength: number;
  startingIndex: number;
}
export const DEFAULT_SETTINGS: FileOrderSettings = {
  delimiter: " ",
  prefixMinLength: 0,
  startingIndex: 0,
};
