import { useState, useMemo } from "react";
import { Table, ConfigProvider } from "antd";
import { IntelligentTableHeader } from "./IntelligentTableHeader/IntelligentTableHeader";
import { IntelligentTableSummary } from "./IntelligentTableSummary/IntelligentTableSummary";
import {
  detectType,
  enhanceColumns,
  formatValue,
  getLeafColumns,
  getValueByDataIndex,
  parseNumericValue,
} from "../../utils/intelligentTable/helperFunctions";
import { transformPipeline } from "../../utils/intelligentTable/dataTransformUtils";
import type { IntelligentTableProps } from "../../types/IntelligentTable/IntelligentTableProps";

export const IntelligentTable = ({
  columns = [],
  dataSource = [],
  dataTransform = ({ pipeline }) => pipeline([]),
  tableThemeConfig = {
    defaultSummaryRow: {},
    legends: {},
    searchBox: {},
    exportButton: {},
    exportButtonDropdown: {},
  },
  defaultSummary = {
    enable: false,
    fixed: false,
  },
  enableLegends = false,
  defaultUniversalSearch = {
    enable: false,
    onSearch: () => false,
  },
  tableExport = {
    enable: false,
    exportFileName: "",
    pdfFontOptions: {
      fontUrl: "",
      fontFileName: "",
      fontName: "",
      fontStyles: [],
      fallbackFont: "",
    },
  },
  ...props
}: IntelligentTableProps) => {
  const enhancedColumns = enhanceColumns(columns);
  const leafColumns = getLeafColumns(enhancedColumns);

  const [searchText, setSearchText] = useState("");

  // Transform data using provided transform function
  const transformedData = useMemo(() => {
    const raw = dataSource ?? [];

    if (!dataTransform) return raw;

    return dataTransform({
      pipeline: (steps) => transformPipeline([...raw], steps),
    });
  }, [dataSource, dataTransform]);

  const filteredData = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    if (!search) return transformedData;

    return transformedData?.filter((row) => {
      if (defaultUniversalSearch.onSearch) {
        return defaultUniversalSearch.onSearch(search, row, leafColumns);
      }
      return leafColumns.some((column) => {
        const dataIndex = column.dataIndex;
        if (dataIndex === undefined) return false;

        const value = getValueByDataIndex(row, dataIndex);
        if (value == null) return false;

        let stringValue: string | null | undefined = null;

        const valueType = detectType(value);

        if (valueType === "string" || typeof value === "boolean") {
          stringValue = String(value);
        } else if (
          valueType === "number" ||
          valueType === "currency" ||
          valueType === "id" ||
          valueType === "percentage" ||
          typeof value === "number"
        ) {
          const parsed = parseNumericValue(value);
          if (parsed.number !== null) {
            stringValue = `${valueType === "currency" ? parsed.symbol : ""}${
              column.roundOff
                ? formatValue(parsed.number, column.roundOff)
                : parsed.number
            }${valueType !== "currency" ? parsed.symbol : ""}`;
          }
        } else if (Array.isArray(value)) {
          stringValue = value.map((v) => String(v)).join(", ");
        } else if (value instanceof Date) {
          stringValue = value.toLocaleString();
        } else if (typeof value === "object" && value !== null) {
          try {
            stringValue = JSON.stringify(value);
          } catch {
            stringValue = null;
          }
        }

        return stringValue?.toLowerCase().includes(search) ?? false;
      });
    });
  }, [defaultUniversalSearch, searchText, transformedData, leafColumns]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: tableThemeConfig,
          Input: tableThemeConfig?.searchBox,
          Button: tableThemeConfig?.exportButton,
          Dropdown: tableThemeConfig?.exportButtonDropdown,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <IntelligentTableHeader
          columns={leafColumns}
          data={filteredData}
          legends={{
            enable: enableLegends,
            style: tableThemeConfig?.legends || {},
          }}
          defaultUniversalSearch={{
            enable: defaultUniversalSearch.enable,
            searchText: searchText,
            setSearchText: setSearchText,
            searchBoxPlaceholderText:
              tableThemeConfig?.searchBox?.placeholderText || "Search table...",
          }}
          exportButton={{
            enable: tableExport.enable,
            exportFileName: tableExport.exportFileName,
            pdfFontOptions: tableExport.pdfFontOptions,
          }}
        />
        <Table
          columns={enhancedColumns}
          dataSource={filteredData}
          summary={
            props.summary
              ? props.summary
              : defaultSummary.enable
              ? (data) => (
                  <Table.Summary
                    fixed={defaultSummary.fixed}
                    children={
                      <IntelligentTableSummary
                        data={data}
                        columns={leafColumns}
                        defaultSummaryRowStyle={
                          tableThemeConfig?.defaultSummaryRow || {}
                        }
                      />
                    }
                  />
                )
              : undefined
          }
          {...props}
        />
      </div>
    </ConfigProvider>
  );
};
