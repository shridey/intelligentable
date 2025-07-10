import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";

export type IntelligentTableExportButtonProps = {
  data: readonly AnyObject[] | undefined;
  columns: IntelligentTableColumnType[];
  exportFileName?: string | undefined;
};
