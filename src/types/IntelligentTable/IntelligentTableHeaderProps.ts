import type { AnyObject } from "antd/es/_util/type";
import type { IntelligentTableColumnType } from "./IntelligentTableColumnType";
import type { IntelligentTableLegendStyleType } from "./IntelligentTableLegendStyleType";
import type { IntelligentTableExportButtonPDFFontOptionsType } from "./IntelligentTableExportButtonPDFFontOptionsType";

/**
 * Props for the IntelligentTable header component.
 *
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for the table header.
 * @property {readonly AnyObject[] | undefined} data - The table data for header context.
 * @property {Object} [legends] - Legend configuration for the header.
 * @property {boolean} legends.enable - Whether to show legends.
 * @property {IntelligentTableLegendStyleType} legends.style - Style configuration for legends.
 * @property {Object} [search] - Universal search configuration.
 * @property {boolean} search.enable - Whether universal search is enabled.
 * @property {string | undefined} search.searchText - Current search text.
 * @property {string | undefined} search.placeholder - Set the placeholder text.
 * @property {React.Dispatch<React.SetStateAction<string>>} search.setSearchText - Setter for search text.
 * @property {string | undefined} [search.placeholder] - Placeholder text for the search box.
 * @property {Object} exportButton - Export button configuration.
 * @property {boolean} exportButton.enable - Whether export is enabled.
 * @property {string | undefined} exportButton.exportFileName - File name for exported data.
 * @property {IntelligentTableExportButtonPDFFontOptionsType} exportButton.pdfFontOptions - Optional font options for exporting PDF.
 */
export type IntelligentTableHeaderProps = {
  columns: IntelligentTableColumnType[];
  data: readonly AnyObject[] | undefined;
  legends?: {
    enable: boolean;
    style: IntelligentTableLegendStyleType;
  };
  search?: {
    enable: boolean;
    searchText: string | undefined;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string | undefined;
  };
  exportButton: {
    enable: boolean;
    exportFileName: string | undefined;
    pdfFontOptions?: IntelligentTableExportButtonPDFFontOptionsType;
  };
};
