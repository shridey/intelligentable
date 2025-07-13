import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableLegendStyleType } from "@/types/IntelligentTable/IntelligentTableLegendStyleType";
import type { AnyObject } from "antd/es/_util/type";

export type IntelligentTableHeaderProps = {
  columns: IntelligentTableColumnType[];
  data: readonly AnyObject[] | undefined;
  legends?: {
    enable: boolean;
    style: IntelligentTableLegendStyleType;
  };
  defaultUniversalSearch?: {
    enable: boolean;
    searchText: string | undefined;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    searchBoxPlaceholderText?: string | undefined;
  };
  exportButton: {
    enable: boolean;
    exportFileName: string | undefined;
  };
};
