import { useState } from "react";
import { Table, Tooltip, Button, message } from "antd";
import { InfoCircleOutlined, CopyOutlined } from "@ant-design/icons";
import styles from "@/Components/IntelligentTable/IntelligentTable.module.css";

// Define types
type ColorThreshold = {
  min?: number;
  max?: number;
  inclusiveMin?: boolean; // default true
  inclusiveMax?: boolean; // default false
  color: string;
};
type ColorMapEntry = {
  value: string | number;
  color: string;
};
type Column = {
  title: string;
  dataIndex: string;
  color?: ColorThreshold[] | ColorMapEntry[];
  operation?: "sum" | "average" | "count";
  filter?: { min?: number; max?: number; effect?: boolean }[];
  width?: number | string;
  children?: Column[];
  sorted?: "asc" | "desc";
};
type FlattenedColumn = {
  dataIndex: string;
  operation?: string;
};
type RecordType = {
  studentId: string | number;
  studentName: string;
  [key: string]: any;
};
export type Grade =
  | "K"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export const gradeOrder: Record<Grade, number> = {
  K: 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "11": 11,
  "12": 12,
};

// Check if the value is a percentage string
const isPercentString = (value: string | number): boolean =>
  typeof value === "string" && value.trim().endsWith("%");

// Parse percentage string into number
const parsePercent = (val: string): number =>
  isPercentString(val) ? parseFloat(val.replace("%", "")) : NaN;

const getThresholdColor = (
  thresholds: ColorThreshold[],
  value: number
): string | undefined => {
  if (!Array.isArray(thresholds) || isNaN(value)) return undefined;

  return thresholds.find(
    ({
      min = -Infinity,
      max = Infinity,
      inclusiveMin = true,
      inclusiveMax = false,
    }) => {
      // Special case: exact match
      if (min === max) return value === min;

      const lowerCheck = inclusiveMin ? value >= min : value > min;
      const upperCheck = inclusiveMax ? value <= max : value < max;

      return lowerCheck && upperCheck;
    }
  )?.color;
};

const getTextColor = (
  colorMap: ColorMapEntry[],
  val: number | string
): string | undefined => {
  if (!Array.isArray(colorMap)) return undefined;
  return colorMap.find((entry) => entry.value === val)?.color;
};

type RecordData = { [key: string]: any };

interface ColumnType {
  dataIndex: string;
}

const getSorter = (
  col: ColumnType
): ((a: RecordData, b: RecordData) => number) => {
  const isGrade = col.dataIndex === "grade";
  const isDayOfWeek = col.dataIndex === "dayOfWeek";

  return (a: RecordData, b: RecordData): number => {
    const aValue = a[col.dataIndex];
    const bValue = b[col.dataIndex];

    const isDate =
      !isNaN(new Date(aValue).getTime()) && !isNaN(new Date(bValue).getTime());
    const isPercent = isPercentString(aValue) && isPercentString(bValue);

    if (isPercent) {
      const pureA = parsePercent(aValue);
      const pureB = parsePercent(bValue);
      return pureA - pureB;
    }

    const isValidGrade = (val: any): val is Grade => val in gradeOrder;

    if (isGrade && isValidGrade(aValue) && isValidGrade(bValue)) {
      const aOrder = gradeOrder[aValue];
      const bOrder = gradeOrder[bValue];
      return aOrder - bOrder;
    }

    if (isDate) {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return aDate.getTime() - bDate.getTime();
    }

    if (isDayOfWeek) {
      const weekOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const aOrder = weekOrder.indexOf(aValue.toLowerCase().slice(0, 3));
      const bOrder = weekOrder.indexOf(bValue.toLowerCase().slice(0, 3));
      return aOrder - bOrder;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return aValue - bValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue);
    }

    return 0;
  };
};

export const applyColumnEnhancements = (
  cols: Column[] = [],
  darkMode: boolean
): any[] =>
  cols.map((col) => {
    const hasChildren = Array.isArray(col.children) && col.children.length > 0;
    const shouldApplyColor = Array.isArray(col.color);

    const getColor = (val: number): string | undefined => {
      if (typeof val !== "number" || !col.color) return undefined;
      return getThresholdColor(col.color as ColorThreshold[], val);
    };

    return {
      ...col,
      title: (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
          title={col.title}
        >
          {col.title}
        </div>
      ),
      key: col.dataIndex,
      align: "center",
      onHeaderCell: () => ({
        style: {
          padding: "6px",
          fontSize: "12px",
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        },
      }),
      onCell: () => ({
        style: {
          padding: "6px",
          fontSize: "12px",
          color: "var(--text-color)",
          backgroundColor: "var(--chart-background)",
        },
      }),
      ...(hasChildren
        ? {
            children: applyColumnEnhancements(col.children, darkMode),
          }
        : {
            sorter: getSorter(col),
            ...(col.sorted && {
              defaultSortOrder: col.sorted === "asc" ? "ascend" : "descend",
            }),
            render: (text: string | number, record: RecordType) => {
              const numericValue = isPercentString(text)
                ? parsePercent(text as string)
                : parseFloat(String(text));
              const color = shouldApplyColor
                ? getColor(numericValue) ||
                  getTextColor(col.color as ColorMapEntry[], text)
                : undefined;

              const content = (
                <span
                  style={{
                    color: darkMode ? "var(--text-color)" : color,
                    textShadow: darkMode
                      ? `-0.6px -0.6px 0px ${color}, 0.6px -0.6px 0px ${color}, -0.6px 0.6px 0px ${color}, 0.6px 0.6px 0px ${color}`
                      : undefined,
                    whiteSpace: "nowrap",
                    verticalAlign: "middle",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 120,
                    display: "inline-block",
                  }}
                >
                  <Tooltip title={text}>
                    {col.dataIndex === "absentCount" && numericValue > 20
                      ? "20+"
                      : text}
                  </Tooltip>
                </span>
              );

              return <div>{content}</div>;
            },
          }),
    };
  });

// Recursively flatten columns to get dataIndex + operation
const flattenColumns = (columns: Column[] = []): FlattenedColumn[] => {
  return columns.reduce<FlattenedColumn[]>((acc, col) => {
    if (col.children) {
      acc.push(...flattenColumns(col.children));
    } else if (col.dataIndex) {
      acc.push({ dataIndex: col.dataIndex, operation: col.operation });
    }
    return acc;
  }, []);
};

const computeSummaryValue = (
  data: Record<string, any>[],
  dataIndex: string,
  operation?: string
): string | number => {
  const values = data.map((row) => row[dataIndex]).filter((val) => val != null);

  if (values.length === 0 || !operation) return "";

  switch (operation) {
    case "sum": {
      if (values.every((v) => typeof v === "number")) {
        const total = (values as number[]).reduce((sum, val) => sum + val, 0);
        return total.toFixed(0);
      }

      if (values.every(isPercentString)) {
        const nums = (values as string[]).map(parsePercent);
        const total = nums.reduce((sum, val) => sum + val, 0);
        return `${total.toFixed(1)}%`;
      }

      return "";
    }

    case "average": {
      if (values.every((v) => typeof v === "number")) {
        const avg =
          (values as number[]).reduce((sum, val) => sum + val, 0) /
          values.length;
        return avg.toFixed(1);
      }

      if (values.every(isPercentString)) {
        const nums = (values as string[]).map(parsePercent);
        const avg = nums.reduce((sum, val) => sum + val, 0) / nums.length;
        return `${avg.toFixed(1)}%`;
      }

      return "";
    }

    case "count":
      return values.length;

    default:
      return "";
  }
};

type RowData = Record<string, any>;

const applyColumnFilters = (data: RowData[], columns: Column[]): RowData[] => {
  const activeFilterCols = columns
    ?.flatMap((col) => (col.children ? col.children : [col]))
    .filter(
      (col) => Array.isArray(col.filter) && col.filter.some((f) => f.effect)
    );

  if (!activeFilterCols || activeFilterCols.length === 0) return data;

  return data?.filter((item) => {
    return activeFilterCols.every((col) => {
      const filters = (col.filter || []).filter((f) => f.effect);
      let value = item[col.dataIndex];

      if (typeof value === "string" && value.endsWith("%")) {
        value = parseFloat(value.replace("%", ""));
      }

      return filters.some(({ min = -Infinity, max = Infinity }) => {
        return typeof value === "number" && value >= min && value < max;
      });
    });
  });
};

type Legend = {
  label: string;
  color: string;
};

const extractLegends = (columns: Column[]): Legend[] => {
  const legendSet = new Map<string, Legend>();

  const isThreshold = (
    entry: ColorThreshold | ColorMapEntry
  ): entry is ColorThreshold => "min" in entry || "max" in entry;

  const collectThresholds = (col: Column): void => {
    if (Array.isArray(col.color)) {
      col.color.forEach((entry) => {
        if (!isThreshold(entry)) return;

        const { min, max, color } = entry;
        const inclusiveMin = entry.inclusiveMin !== false; // default true
        const inclusiveMax = entry.inclusiveMax === true; // default false

        const key = `${min ?? "-∞"}-${
          max ?? "∞"
        }-${inclusiveMin}-${inclusiveMax}-${color}`;

        const format = (val: number) =>
          val % 1 !== 0 ? val.toFixed(1) : val.toString();

        const getLabel = (): string => {
          const minSymbol = inclusiveMin ? "≥" : ">";
          const maxSymbol = inclusiveMax ? "≤" : "<";

          if (min != null && max != null && min === max) {
            return `= ${format(min)}`;
          }

          if (min != null && max != null) {
            return `${minSymbol} ${format(min)} and ${maxSymbol} ${format(
              max
            )}`;
          }

          if (min != null) return `${minSymbol} ${format(min)}`;
          if (max != null) return `${maxSymbol} ${format(max)}`;
          return "";
        };

        legendSet.set(key, { label: getLabel(), color });
      });
    }

    if (Array.isArray(col.children)) {
      col.children.forEach(collectThresholds);
    }
  };

  columns?.forEach(collectThresholds);
  return Array.from(legendSet.values());
};

// Function to convert table data to TSV (Tab-Separated Values) format
const convertToTSV = (
  columns: Column[],
  data: Record<string, any>[]
): string => {
  // Recursively flatten nested column structure
  const flattenColumnsRecursive = (cols: Column[]): Column[] =>
    cols.reduce<Column[]>((acc, col) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        return acc.concat(flattenColumnsRecursive(col.children));
      }
      return acc.concat(col);
    }, []);

  const flatColumns = flattenColumnsRecursive(columns);

  // Extract headers
  const headers = flatColumns.map((col) =>
    typeof col.title === "string" ? col.title : ""
  );

  // Extract and sanitize each row
  const rows = data.map((row) =>
    flatColumns.map((col) => {
      const val = row[col.dataIndex];
      const safeVal = val !== undefined && val !== null ? String(val) : "";

      // Replace tabs/newlines to preserve TSV structure
      return safeVal.replace(/\t/g, " ").replace(/\r?\n/g, " ");
    })
  );

  // Combine headers and rows into final TSV string
  const tsvLines = [headers, ...rows].map((line) => line.join("\t"));
  return tsvLines.join("\n");
};

const IntelligentTable = ({
  columns = [],
  data = [],
  summaryTitle = "",
  instructions = "",
  loading = true,
  pagination = false,
  skickyHeader = false,
  enableLegends = false,
  enableSummary = true,
  enableCopy = true,
  darkMode = false,
}) => {
  const modifiedColumns = applyColumnEnhancements(columns, darkMode);
  const flatCols = flattenColumns(columns);
  const legends = extractLegends(columns);

  const summaryRowStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "var(--text-color)",
    backgroundColor: "var(--background-color)",
  };

  type RowData = {
    studentId: string;
    studentName: string;
    key: string | number;
    [key: string]: any;
  };

  const summary = (pageData: readonly RowData[]) => {
    const mutableData = [...pageData];
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={summaryRowStyle}>
          {flatCols?.map(({ dataIndex, operation }, index) => {
            const rawContent =
              index === 0
                ? operation === "count"
                  ? `Count: ${computeSummaryValue(
                      mutableData,
                      dataIndex,
                      operation
                    )}${summaryTitle ? ` | ${summaryTitle}` : ""}`
                  : summaryTitle || ""
                : computeSummaryValue(mutableData, dataIndex, operation);

            const content = rawContent?.toString() ?? "";

            const colorConfig = (columns as Column[])
              .flatMap((col) => (col.children ? col.children : [col]))
              .find((col) => col.dataIndex === dataIndex)?.color;

            const value = isPercentString(content)
              ? parsePercent(content)
              : parseFloat(content);

            const color =
              colorConfig && !isNaN(value)
                ? getThresholdColor(colorConfig, value)
                : undefined;

            const textShadow = darkMode
              ? `-0.6px -0.6px 0px ${color}, 0.6px -0.6px 0px ${color}, -0.6px 0.6px 0px ${color}, 0.6px 0.6px 0px ${color}`
              : undefined;

            return (
              <Table.Summary.Cell
                key={dataIndex || index}
                index={index}
                align="center"
              >
                <div
                  style={{
                    lineHeight: "0",
                    color: darkMode ? "var(--text-color)" : color,
                    textShadow,
                  }}
                >
                  {content}
                </div>
              </Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      const tsvData = convertToTSV(columns, applyColumnFilters(data, columns));

      // First try the modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(tsvData);
        message.success(
          "Table data copied to clipboard! Ready to paste into Excel"
        );
        return;
      }

      // Fallback for browsers that don't support Clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = tsvData;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          message.success("Table data copied to clipboard! Paste into Excel");
        } else {
          throw new Error("Copy command failed");
        }
      } finally {
        document.body.removeChild(textarea);
      }
    } catch (error) {
      console.error("Copy failed:", error);
      message.error(
        "Failed to copy table data. Please try again or use keyboard shortcuts."
      );

      // Provide the data as a downloadable file as a last resort
      const tsvData = convertToTSV(columns, data);
      const blob = new Blob([tsvData], { type: "text/tab-separated-values" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table-data.tsv";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const renderHeaders = () => {
    return (
      <div
        style={{
          margin: "0 0 15px 9px",
          display: "flex",
          justifyContent:
            (instructions.length > 0 || enableCopy) && enableLegends
              ? "space-between"
              : enableLegends
              ? "flex-start"
              : "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {enableLegends && (
          <div style={{ display: "flex", gap: "18px" }}>
            {legends.map(({ label, color }, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: color,
                    borderRadius: "3px",
                    border: "1px solid #ccc",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-color)",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {instructions && (
            <div
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                fontWeight: "bold",
                border: "1px solid",
                padding: "6px 10px",
                fontSize: "12px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <InfoCircleOutlined />
              <span>{instructions}</span>
            </div>
          )}
          {enableCopy && (
            <Tooltip title="Copy table data to clipboard">
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyToClipboard}
                style={{
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                  fontWeight: "bold",
                  border: "1px solid",
                  padding: "5px 10px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                Copy
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalWidth: number = columns.reduce(
    (acc: number, col: { width?: number }) => {
      const colWidth: number = typeof col.width === "number" ? col.width : 120;
      return acc + colWidth;
    },
    0
  );

  return (
    <>
      {renderHeaders()}

      <Table
        className={styles["custom-table"]}
        rowKey={(record) => `${modifiedColumns[0].dataIndex}-${record.key}`}
        columns={modifiedColumns}
        dataSource={
          applyColumnFilters(data, columns).map((row, index) => ({
            ...row,
            key: row.key ?? `${row.studentId ?? index}`,
            studentId: row.studentId ?? "",
            studentName: row.studentName ?? "",
          })) satisfies RowData[]
        }
        tableLayout="fixed"
        summary={enableSummary ? summary : undefined}
        sticky={skickyHeader}
        scroll={{
          y: 321,
          x: totalWidth,
        }}
        loading={loading}
        bordered
        virtual
        pagination={
          pagination && {
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100", `${data.length}`],
            pageSize,
            current: currentPage,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }
        }
      />
    </>
  );
};

export default IntelligentTable;
