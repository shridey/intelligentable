import type { TableProps } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { SummaryProps } from "rc-table/lib/Footer/Summary";
import type { IntelligentTableColumnType } from "./IntelligentTableColumnType";
import type { IntelligentTableThemeConfigType } from "./IntelligentTableThemeConfigType";
import type { IntelligentTableExportButtonPDFFontOptionsType } from "./IntelligentTableExportButtonPDFFontOptionsType";

/**
 * Props for the IntelligentTable component.
 *
 * @extends TableProps
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for the table.
 * @property {readonly AnyObject[]} dataSource - The data to display in the table.
 * @property {(ctx: { pipeline: (steps: Array<(data: AnyObject[]) => AnyObject[]>) => AnyObject[] }) => AnyObject[]} [dataTransform] - Function to transform data before rendering, using a composable pipeline.
 * @property {IntelligentTableThemeConfigType} [tableThemeConfig] - Theme configuration for customizing table appearance.
 * @property {{ enable?: boolean; fixed?: SummaryProps["fixed"] }} [defaultSummary] - Configuration for the summary row.
 * @property {boolean} [enableLegends] - Whether to display legends for color rules.
 * @property {{ enable: boolean; placeholder: string; onSearch?: (searchText: string | undefined, row: AnyObject, columns: IntelligentTableColumnType[]) => boolean }} [search] - Universal search configuration and custom search logic.
 * @property {{ enable: boolean; exportFileName?: string | undefined }} [tableExport] - Export configuration for table data.
 * @property {IntelligentTableExportButtonPDFFontOptionsType} tableExport.pdfFontOptions - Optional font options for exporting PDF.
 */
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
  search?: {
    enable: boolean;
    placeholder?: string;
    onSearch?: (
      searchText: string | undefined,
      row: AnyObject,
      columns: IntelligentTableColumnType[]
    ) => boolean;
  };
  tableExport?: {
    enable: boolean;
    exportFileName?: string | undefined;
    pdfFontOptions?: IntelligentTableExportButtonPDFFontOptionsType;
  };
}
