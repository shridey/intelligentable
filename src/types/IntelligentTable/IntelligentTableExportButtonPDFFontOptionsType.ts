/**
 * Font Options for Table PDF Export.
 *
 * @property {string} [fontUrl] - Local Font URL (eg. "../assets/fonts/NotoSans-Regular.ttf").
 * @property {string} [fontFileName] - Name of the Font File with extension (eg. "NotoSans-Regular.ttf").
 * @property {string} [fontName] - Name of the Font (eg. "NotoSans").
 * @property {string[]} [fontStyles] - Font styles (eg. ["normal"]).
 * @property {string} [fallbackFont] - Alternative font if the mentioned font fails to render (eg. "helvetica").
 */
export type IntelligentTableExportButtonPDFFontOptionsType = {
  fontUrl?: string;
  fontFileName?: string;
  fontName?: string;
  fontStyles?: string[];
  fallbackFont?: string;
};
