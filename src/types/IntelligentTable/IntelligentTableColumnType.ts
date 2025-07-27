import type { TableColumnType } from "antd";
import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";

/**
 * Extended column type for IntelligentTable.
 *
 * @extends TableColumnType
 * @property {IntelligentTableColumnType[]} [children] - Nested columns for grouped headers.
 * @property {number} [roundOff] - Number of decimal places to round numeric values in this column.
 * @property {IntelligentTableColorConfigType[]} [colorConfig] - Array of color rules for dynamic cell coloring.
 * @property {"sum" | "average" | "count" | "max" | "min"} [summaryOperation] - Summary operation to display in the summary row for this column.
 * @property {boolean} [displaySummaryOperationInSummary] - Whether to display the summary operation name in the summary row.
 */
export interface IntelligentTableColumnType extends TableColumnType {
  children?: IntelligentTableColumnType[];
  roundOff?: number | undefined;
  colorConfig?: IntelligentTableColorConfigType[];
  summaryOperation?: "sum" | "average" | "count" | "max" | "min";
  displaySummaryOperationInSummary?: boolean;
}
