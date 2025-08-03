import type { AnyObject } from "antd/es/_util/type";
import type { IntelligentTableColumnType } from "./IntelligentTableColumnType";
import type { IntelligentTableExportButtonPDFFontOptionsType } from "./IntelligentTableExportButtonPDFFontOptionsType";

/**
 * Props for the export button component in IntelligentTable.
 *
 * @property {readonly AnyObject[] | undefined} data - The table data to be exported.
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for export.
 * @property {string | undefined} [exportFileName] - Optional file name for the exported file.
 * @property {IntelligentTableExportButtonPDFFontOptionsType} pdfFontOptions - Optional font options for exporting PDF.
 */
export type IntelligentTableExportButtonProps = {
  data: readonly AnyObject[] | undefined;
  columns: IntelligentTableColumnType[];
  exportFileName?: string | undefined;
  pdfFontOptions?: IntelligentTableExportButtonPDFFontOptionsType;
};
