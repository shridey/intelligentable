import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";

export type IntelligentTableSummaryProps = {
  data: readonly AnyObject[] | undefined;
  columns: IntelligentTableColumnType[];
  defaultSummaryRowStyle?: Pick<
    React.CSSProperties,
    "color" | "backgroundColor" | "fontWeight"
  >;
};
