import type { TableProps } from "antd";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableThemeConfigType } from "@/types/IntelligentTable/IntelligentTableThemeConfigType";
import type { AnyObject } from "antd/es/_util/type";
import type { SummaryProps } from "rc-table/lib/Footer/Summary";

export interface IntelligentTableProps extends TableProps {
  columns: IntelligentTableColumnType[];
  dataSource: readonly AnyObject[];
  dataTransform?: (ctx: {
    pipeline: (steps: Array<(data: AnyObject[]) => AnyObject[]>) => AnyObject[];
  }) => AnyObject[];
  tableThemeConfig?: IntelligentTableThemeConfigType;
  defaultSummary?: {
    enable?: boolean;
    fixed?: SummaryProps["fixed"];
  };
  enableLegends?: boolean;
  defaultUniversalSearch?: {
    enable: boolean;
    onSearch?: (
      searchText: string | undefined,
      row: AnyObject,
      columns: IntelligentTableColumnType[]
    ) => boolean;
  };
  tableExport?: {
    enable: boolean;
    exportFileName?: string | undefined;
  };
}
