import { Input } from "antd";
import { IntelligentTableLegends } from "../IntelligentTableLegends/IntelligentTableLegends";
import { IntelligentTableExportButton } from "../IntelligentTableExportButton/IntelligentTableExportButton";
import type { IntelligentTableHeaderProps } from "../../../types/IntelligentTable/IntelligentTableHeaderProps";
import { SearchOutlined } from "@ant-design/icons";

export const IntelligentTableHeader = ({
  columns = [],
  data = [],
  legends = {
    enable: false,
    style: {},
  },
  defaultUniversalSearch = {
    enable: false,
    searchText: "",
    setSearchText: (v) => v,
    searchBoxPlaceholderText: "Search table...",
  },
  exportButton = {
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
}: IntelligentTableHeaderProps) => {
  return (
    (legends.enable ||
      defaultUniversalSearch.enable ||
      exportButton.enable) && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: 12,
          columnGap: 12,
        }}
      >
        {legends.enable && (
          <IntelligentTableLegends
            columns={columns}
            legendStyle={legends.style}
          />
        )}

        {defaultUniversalSearch.enable &&
          defaultUniversalSearch.searchText !== undefined &&
          defaultUniversalSearch.setSearchText && (
            <div
              style={{
                flex: 1,
                minWidth: 300,
              }}
            >
              <Input
                style={{
                  width: "100%",
                }}
                placeholder={defaultUniversalSearch.searchBoxPlaceholderText}
                value={defaultUniversalSearch.searchText}
                onChange={(e) =>
                  defaultUniversalSearch.setSearchText(e.target.value)
                }
                size="middle"
                suffix={<SearchOutlined />}
              />
            </div>
          )}

        {exportButton.enable && (
          <IntelligentTableExportButton
            data={data}
            columns={columns}
            exportFileName={exportButton.exportFileName}
            pdfFontOptions={exportButton.pdfFontOptions}
          />
        )}
      </div>
    )
  );
};
