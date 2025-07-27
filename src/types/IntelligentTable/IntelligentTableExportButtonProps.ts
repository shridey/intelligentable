import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";

/**
 * Props for the export button component in IntelligentTable.
 *
 * @property {readonly AnyObject[] | undefined} data - The table data to be exported.
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for export.
 * @property {string | undefined} [exportFileName] - Optional file name for the exported file.
 */
export type IntelligentTableExportButtonProps = {
  data: readonly AnyObject[] | undefined;
  columns: IntelligentTableColumnType[];
  exportFileName?: string | undefined;
};
