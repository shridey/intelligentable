import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";

/**
 * Props for the summary row in IntelligentTable.
 *
 * @property {readonly AnyObject[] | undefined} data - The table data for summary calculations.
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for summary calculations.
 * @property {Pick<React.CSSProperties, "color" | "backgroundColor" | "fontWeight">} [defaultSummaryRowStyle] - Optional style configuration for the summary row.
 */
export type IntelligentTableSummaryProps = {
  data: readonly AnyObject[] | undefined;
  columns: IntelligentTableColumnType[];
  defaultSummaryRowStyle?: Pick<
    React.CSSProperties,
    "color" | "backgroundColor" | "fontWeight"
  >;
};
