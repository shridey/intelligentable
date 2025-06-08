import { useState } from "react";
import { Link } from "react-router-dom";
import { intelligentTablePropTypes } from "../../utilities/propTypes";
import { Table, Tooltip, Button, message } from "antd";
import { InfoCircleOutlined, CopyOutlined } from "@ant-design/icons";
import styles from "./IntelligentTable.module.css";

const gradeOrder = {
  K: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};

// Check if the value is a percentage string
const isPercentString = (value) =>
  typeof value === "string" && value.trim().endsWith("%");

// Parse percentage string into number
const parsePercent = (val) =>
  isPercentString(val) ? parseFloat(val.replace("%", "")) : NaN;

// Helper function to get color based on thresholds
const getThresholdColor = (thresholds, value) => {
  if (!Array.isArray(thresholds) || isNaN(value)) return undefined;
  return thresholds.find(
    ({ min = -Infinity, max = Infinity }) => value >= min && value < max
  )?.color;
};

const getTextColor = (colorMap, val) => {
  if (!Array.isArray(colorMap)) return undefined;
  return colorMap.find((entry) => entry.value === val)?.color;
};

// Get sorter function based on column type
const getSorter = (col) => {
  const isGrade = col.dataIndex === "grade";
  const isDayOfWeek = col.dataIndex === "dayOfWeek";

  return (a, b) => {
    const aValue = a[col.dataIndex];
    const bValue = b[col.dataIndex];

    const isDate = !isNaN(new Date(aValue)) && !isNaN(new Date(bValue));
    const isPercent = isPercentString(aValue) && isPercentString(bValue);

    if (isPercent) {
      const pureA = parsePercent(aValue);
      const pureB = parsePercent(bValue);

      return pureA - pureB;
    }

    if (isGrade) {
      const aOrder = gradeOrder[aValue] ?? Infinity;
      const bOrder = gradeOrder[bValue] ?? Infinity;
      return aOrder - bOrder;
    }

    if (isDate) {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return aDate - bDate;
    }

    if (isDayOfWeek) {
      const weekOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const aOrder = weekOrder.indexOf(aValue);
      const bOrder = weekOrder.indexOf(bValue);
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

// Apply color thresholds, sorting, and column enhancements
const applyColumnEnhancements = (cols, darkMode, schoolName) =>
  cols?.map((col) => {
    const hasChildren = Array.isArray(col.children) && col.children.length > 0;
    const shouldApplyColor = col.color && Array.isArray(col.color);
    const hasClickHandler = typeof col.handleClick === "function";

    const getColor = (val) => {
      if (typeof val !== "number" || !col.color) return undefined;
      return getThresholdColor(col.color, val);
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
          padding: "6.6px",
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
          cursor: hasClickHandler ? "pointer" : "default",
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
            render: (text, record) => {
              const numericValue = isPercentString(text)
                ? parsePercent(text)
                : parseFloat(text);
              const color = shouldApplyColor
                ? getColor(numericValue) || getTextColor(col.color, text)
                : undefined;

              const handleClick = async (e) => {
                e.stopPropagation();
                try {
                  await col.handleClick(
                    record.studentId,
                    record.studentName,
                    col.title
                  );
                } catch (error) {
                  console.error("Click handler failed:", error);
                  message.error("Failed to process click action");
                }
              };

              const content = (
                <span
                  style={{
                    color: darkMode ? "var(--text-color)" : color,
                    textShadow:
                      darkMode &&
                      `-0.6px -0.6px 0px ${color}, 0.6px -0.6px 0px ${color}, -0.6px 0.6px 0px ${color}, 0.6px 0.6px 0px ${color}`,
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

              return hasClickHandler ? (
                <div onClick={parsePercent(text) !== 100 ? handleClick : null}>
                  {content}
                </div>
              ) : (
                <div>
                  {col.dataIndex === "studentName" ||
                  col.dataIndex === "studentId" ? (
                    <Link
                      to={`/${schoolName}/student-profiles/${record.studentId}`}
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            },
          }),
    };
  });

// Recursively flatten columns to get dataIndex + operation
const flattenColumns = (columns) => {
  return columns?.reduce((acc, col) => {
    if (col.children) {
      acc.push(...flattenColumns(col.children));
    } else if (col.dataIndex) {
      acc.push({ dataIndex: col.dataIndex, operation: col.operation });
    }
    return acc;
  }, []);
};

// Compute summary values (sum, average, count)
const computeSummaryValue = (data, dataIndex, operation) => {
  const values = data.map((row) => row[dataIndex]).filter((val) => val != null);

  if (values.length === 0 || !operation) return "";

  switch (operation) {
    case "sum": {
      if (values.every((v) => typeof v === "number")) {
        const nums = values.filter((v) => typeof v === "number");
        const total = nums.reduce((sum, val) => sum + val, 0);
        return total.toFixed(0);
      }

      if (values.every(isPercentString)) {
        const nums = values.map(parsePercent);
        const total = nums.reduce((sum, val) => sum + val, 0);
        return `${total.toFixed(1)}%`;
      }

      return "";
    }

    case "average": {
      if (values.every((v) => typeof v === "number")) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        return avg.toFixed(1);
      }

      if (values.every(isPercentString)) {
        const nums = values.map(parsePercent);
        const avg = nums.reduce((sum, val) => sum + val, 0) / nums.length;
        return `${avg.toFixed(1)}%`;
      }

      return "";
    }

    case "count": {
      return values.length;
    }

    default:
      return "";
  }
};

const applyColumnFilters = (data, columns) => {
  const activeFilterCols = columns
    ?.flatMap((col) => (col.children ? col.children : [col]))
    .filter(
      (col) => Array.isArray(col.filter) && col.filter.some((f) => f.effect)
    );

  if (activeFilterCols?.length === 0) return data;

  return data?.filter((item) => {
    return activeFilterCols?.every((col) => {
      const filters = col.filter.filter((f) => f.effect);
      let value = item[col.dataIndex];

      // Convert percentage string to number
      if (typeof value === "string" && value.endsWith("%")) {
        value = parseFloat(value.replace("%", ""));
      }

      return filters.some(({ min = -Infinity, max = Infinity }) => {
        return value >= min && value < max;
      });
    });
  });
};

const extractLegends = (columns) => {
  const legendSet = new Map();

  const collectThresholds = (col) => {
    if (col.color) {
      col.color.forEach(({ min, max, color }) => {
        const key = `${min ?? "-∞"}-${max ?? "∞"}-${color}`;
        const label =
          min != null && max != null
            ? `${
                String(min).includes(".") ? "> " + (min - 0.1) : "≥ " + min
              } - ${
                String(max).includes(".") ? "≤ " + (max - 0.1) : "< " + max
              }`
            : min != null
            ? `${String(min).includes(".") ? "> " + (min - 0.1) : "≥ " + min}`
            : `${String(max).includes(".") ? "≤ " + (max - 0.1) : "< " + max}`;
        legendSet.set(key, { label, color });
      });
    }
    if (col.children) {
      col.children.forEach(collectThresholds);
    }
  };

  columns?.forEach(collectThresholds);
  return Array.from(legendSet.values());
};

// Function to convert table data to TSV (Tab-Separated Values) format
const convertToTSV = (columns, data) => {
  // Flatten the columns structure to get all leaf columns
  const flattenColumnsRecursive = (cols) => {
    return cols.reduce((acc, col) => {
      if (col.children) {
        return [...acc, ...flattenColumnsRecursive(col.children)];
      }
      return [...acc, col];
    }, []);
  };

  const flatColumns = flattenColumnsRecursive(columns);

  // Get headers
  const headers = flatColumns.map((col) => col.title).join("\t");

  // Get rows
  const rows = data.map((row) => {
    return flatColumns
      .map((col) => {
        const value = row[col.dataIndex];
        // Handle undefined/null values and convert to string
        const textValue =
          value !== undefined && value !== null ? String(value) : "";
        // Replace tabs and newlines in the data to prevent formatting issues
        return textValue.replace(/\t/g, " ").replace(/\n/g, " ");
      })
      .join("\t");
  });

  return [headers, ...rows].join("\n");
};

const IntelligentTable = ({
  columns,
  data,
  schoolName = "icps-clone",
  summaryTitle,
  instructions = "",
  loading = true,
  pagination = false,
  skickyHeader = false,
  enableLegends = false,
  enableSummary = true,
  enableCopy = true,
  darkMode = false,
}) => {
  const modifiedColumns = applyColumnEnhancements(
    columns,
    darkMode,
    schoolName
  );
  const flatCols = flattenColumns(columns);
  const legends = extractLegends(columns);

  const summaryRowStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "var(--text-color)",
    backgroundColor: "var(--background-color)",
  };

  const summary = (pageData) => (
    <Table.Summary fixed>
      <Table.Summary.Row style={summaryRowStyle}>
        {flatCols?.map(({ dataIndex, operation }, index) => {
          const content =
            index === 0
              ? operation === "count"
                ? `Count: ${computeSummaryValue(
                    pageData,
                    dataIndex,
                    operation
                  )}${summaryTitle ? ` | ${summaryTitle}` : ""}`
                : summaryTitle
                ? summaryTitle
                : ""
              : computeSummaryValue(pageData, dataIndex, operation);

          const colorConfig = columns
            .flatMap((c) => (c.children ? c.children : [c]))
            .find((c) => c.dataIndex === dataIndex)?.color;

          const value = isPercentString(content)
            ? parsePercent(content)
            : parseFloat(content);

          const color =
            colorConfig && !isNaN(value)
              ? getThresholdColor(colorConfig, value)
              : undefined;

          return (
            <Table.Summary.Cell key={dataIndex || index} align="center">
              <div
                style={{
                  lineHeight: "0.1",

                  color: darkMode ? "var(--text-color)" : color,
                  textShadow:
                    darkMode &&
                    `-0.6px -0.6px 0px ${color}, 0.6px -0.6px 0px ${color}, -0.6px 0.6px 0px ${color}, 0.6px 0.6px 0px ${color}`,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
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

  const totalWidth = columns.reduce((acc, col) => {
    // If width is a number, use it; else default to 120
    const colWidth = typeof col.width === "number" ? col.width : 120;
    return acc + colWidth;
  }, 0);

  return (
    <>
      {renderHeaders()}

      <Table
        className={styles["custom-table"]}
        rowKey={(record) => `${modifiedColumns[0].dataIndex}-${record.key}`}
        columns={modifiedColumns}
        dataSource={applyColumnFilters(data, columns)}
        tableLayout="fixed"
        summary={enableSummary ? summary : null}
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

IntelligentTable.propTypes = intelligentTablePropTypes;

export default IntelligentTable;
