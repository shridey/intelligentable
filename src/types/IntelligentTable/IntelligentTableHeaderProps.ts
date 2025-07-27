import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableLegendStyleType } from "@/types/IntelligentTable/IntelligentTableLegendStyleType";
import type { AnyObject } from "antd/es/_util/type";

/**
 * Props for the IntelligentTable header component.
 *
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for the table header.
 * @property {readonly AnyObject[] | undefined} data - The table data for header context.
 * @property {Object} [legends] - Legend configuration for the header.
 * @property {boolean} legends.enable - Whether to show legends.
 * @property {IntelligentTableLegendStyleType} legends.style - Style configuration for legends.
 * @property {Object} [defaultUniversalSearch] - Universal search configuration.
 * @property {boolean} defaultUniversalSearch.enable - Whether universal search is enabled.
 * @property {string | undefined} defaultUniversalSearch.searchText - Current search text.
 * @property {React.Dispatch<React.SetStateAction<string>>} defaultUniversalSearch.setSearchText - Setter for search text.
 * @property {string | undefined} [defaultUniversalSearch.searchBoxPlaceholderText] - Placeholder text for the search box.
 * @property {Object} exportButton - Export button configuration.
 * @property {boolean} exportButton.enable - Whether export is enabled.
 * @property {string | undefined} exportButton.exportFileName - File name for exported data.
 */
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
