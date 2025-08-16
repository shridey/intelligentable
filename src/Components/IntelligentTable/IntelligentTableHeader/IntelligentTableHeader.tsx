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
  search = {
    enable: false,
    searchText: "",
    setSearchText: (v) => v,
    placeholder: "Search table...",
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
    (legends.enable || search.enable || exportButton.enable) && (
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

        {search.enable &&
          search.searchText !== undefined &&
          search.setSearchText && (
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
                placeholder={search.placeholder || "Search table..."}
                value={search.searchText}
                onChange={(e) => search.setSearchText(e.target.value)}
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
