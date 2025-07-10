import type { TableProps } from "antd";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableThemeConfigType } from "@/types/IntelligentTable/IntelligentTableThemeConfigType";
import type { AnyObject } from "antd/es/_util/type";

export interface IntelligentTableProps extends TableProps {
  columns?: IntelligentTableColumnType[];
  dataSource?: readonly AnyObject[] | undefined;
  tableThemeConfig?: IntelligentTableThemeConfigType;
  enableDefaultSummary?: boolean | undefined;
  enableLegends?: boolean | undefined;
  defaultUniversalSearch?: {
    enable: boolean | undefined;
    onSearch?: (
      searchText: string,
      row: AnyObject,
      columns: IntelligentTableColumnType[]
    ) => boolean | undefined;
  };
  tableExport?: {
    enable: boolean | undefined;
    exportFileName?: string | undefined;
  };
}
