import type { TableColumnType } from "antd";
import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";

export interface IntelligentTableColumnType extends TableColumnType {
  children?: IntelligentTableColumnType[];
  roundOff?: number | undefined;
  colorConfig?: IntelligentTableColorConfigType[];
  summaryOperation?: "sum" | "average" | "count" | "max" | "min";
  displaySummaryOperationInSummary?: boolean;
}
