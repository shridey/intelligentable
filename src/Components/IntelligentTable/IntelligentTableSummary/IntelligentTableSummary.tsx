import { Table } from "antd";
import {
  detectType,
  formatValue,
  getMostFrequentSymbol,
  parseNumericValue,
} from "@/utils/intelligentTable/helperFunctions";
import { getColor } from "@/utils/intelligentTable/createIntelligentTableColoredText";
import type { IntelligentTableSummaryProps } from "@/types/IntelligentTable/IntelligentTableSummaryProps";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";
import type { AnyObject } from "antd/es/_util/type";

const computeSummary = (
  data: readonly AnyObject[] | undefined,
  columns: IntelligentTableColumnType[]
) => {
  const summaryData: Record<string, number | string> = {};

  columns.forEach((column) => {
    const operation = column.summaryOperation;
    const key = column.dataIndex as string;

    if (!operation) return;

    const rawValues = (data as AnyObject[]).map(
      (item) => (item as AnyObject)[key]
    );

    const type = detectType(rawValues.find((val) => val != null));

    if (operation === "count") {
      summaryData[key] = rawValues.length;
      return;
    }

    // For numeric-based operations (number, percentage, currency, id)
    const numericTypes = ["number", "percentage", "currency", "id"];

    if (numericTypes.includes(type)) {
      const symbols: string[] = [];

      const numericValues = rawValues
        .map((v) => {
          const { number, symbol } = parseNumericValue(v);

          if (number != null) symbols.push(symbol);
          return number;
        })
        .filter((v): v is number => typeof v === "number");

      const mostFrequentSymbol = getMostFrequentSymbol(symbols);

      const applyRounding = (val: number): string | number => {
        return column.roundOff !== undefined
          ? formatValue(val, column.roundOff)
          : val;
      };

      const formatWithSymbol = (val: string | number): string => {
        const prefix =
          type === "currency" || type === "id" ? mostFrequentSymbol : "";
        const suffix =
          type !== "currency" && type !== "id" ? mostFrequentSymbol : "";
        return `${prefix}${val}${suffix}`;
      };

      switch (operation) {
        case "sum": {
          const sum = numericValues.reduce((a, b) => a + b, 0);
          summaryData[key] = formatWithSymbol(applyRounding(sum));
          break;
        }

        case "average": {
          const avg =
            numericValues.reduce((a, b) => a + b, 0) /
            (numericValues.length || 1);
          summaryData[key] = formatWithSymbol(applyRounding(avg));
          break;
        }

        case "max": {
          const max = Math.max(...numericValues);
          summaryData[key] = formatWithSymbol(applyRounding(max));
          break;
        }

        case "min": {
          const min = Math.min(...numericValues);
          summaryData[key] = formatWithSymbol(applyRounding(min));
          break;
        }
      }
    }

    // For date-based operations
    if (type === "date") {
      const dateValues = rawValues
        .map((v) => new Date(String(v)))
        .filter((d) => !isNaN(d.getTime()));

      if (dateValues.length === 0) return;

      switch (operation) {
        case "max":
          summaryData[key] = dateValues
            .reduce((a, b) => (a > b ? a : b))
            .toLocaleDateString();
          break;
        case "min":
          summaryData[key] = dateValues
            .reduce((a, b) => (a < b ? a : b))
            .toLocaleDateString();
          break;
      }
    }
  });

  return summaryData;
};

export const IntelligentTableSummary = ({
  data = [],
  columns = [],
}: IntelligentTableSummaryProps) => {
  const summary = computeSummary(data, columns);

  return (
    <Table.Summary>
      <Table.Summary.Row>
        {columns.map((column, index) => {
          const key = String(column.dataIndex);
          const value =
            index === 0 ? `Summary ${summary[key] || ""}` : summary[key] || "-";

          const color = getColor(
            column.colorConfig as IntelligentTableColorConfigType[],
            value
          );

          return (
            <Table.Summary.Cell key={index} index={index} align={column.align}>
              <span
                style={{
                  textOverflow: column.ellipsis ? "ellipsis" : undefined,
                  whiteSpace: column.ellipsis ? "nowrap" : undefined,
                  overflow: column.ellipsis ? "hidden" : undefined,
                  maxWidth: column.ellipsis ? column.width : undefined,
                  display: column.ellipsis ? "block" : undefined,
                  color: color,
                }}
                title={String(value)}
              >
                {value}&nbsp;
                {column.displaySummaryOperationInSummary && (
                  <sub>({column.summaryOperation})</sub>
                )}
              </span>
            </Table.Summary.Cell>
          );
        })}
      </Table.Summary.Row>
    </Table.Summary>
  );
};
