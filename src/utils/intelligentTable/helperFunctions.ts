import type { CompareFn } from "antd/es/table/interface";
import { createIntelligentTableColoredText } from "./createIntelligentTableColoredText";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { AnyObject } from "antd/es/_util/type";
import type { DataIndex } from "rc-table/lib/interface";

const shortWeekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const longWeekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const shortToFull = {
  sun: "sunday",
  mon: "monday",
  tue: "tuesday",
  wed: "wednesday",
  thu: "thursday",
  fri: "friday",
  sat: "saturday",
};

/**
 * Parses a date value into a timestamp for sorting.
 * Supports DD/MM/YYYY, DD/MM/YY, ISO, and long month formats.
 *
 * @param {string | number | Date} value - The date value to parse.
 * @returns {number} The timestamp for sorting.
 */
const parseDateForSort = (value: string | number | Date): number => {
  const str = String(value).trim();

  // Handles DD/MM/YYYY or DD/MM/YY
  const ddmmyyyy = /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/;

  if (ddmmyyyy.test(str)) {
    const [dd, mm, yy] = str.split(/[/-]/).map(Number);
    const yyyy = yy < 100 ? (yy > 50 ? 1900 + yy : 2000 + yy) : yy;
    const parsed = new Date(yyyy, mm - 1, dd);
    return parsed.getTime();
  }

  // Fallback for ISO, long month, etc.
  return new Date(str).getTime();
};

/**
 * Returns a sorter function for a column based on its type.
 * If a custom sorter is provided, it is used. Otherwise, generates a smart sorter.
 *
 * @param {IntelligentTableColumnType} column - The column configuration.
 * @returns {boolean | CompareFn} The sorter function or boolean.
 */
const getSorter = (column: IntelligentTableColumnType): boolean | CompareFn => {
  if (typeof column.sorter === "function" || typeof column.sorter === "boolean")
    return column.sorter as boolean | CompareFn;

  const key = column.dataIndex;
  if (typeof key !== "string" && typeof key !== "number") return false;

  return (a: Record<string, unknown>, b: Record<string, unknown>): number => {
    const aValue = a[key];
    const bValue = b[key];

    const type = detectType(aValue);

    // Handle nullish
    if (aValue == null) return -1;
    if (bValue == null) return 1;

    switch (type) {
      case "number":
        return Number(aValue) - Number(bValue);

      case "percentage":
      case "currency":
      case "id": {
        const a = parseNumericValue(aValue);
        const b = parseNumericValue(bValue);

        const aNum = a.number;
        const bNum = b.number;

        if (aNum === null) return bNum === null ? 0 : -1;
        if (bNum === null) return 1;

        return aNum - bNum;
      }

      case "date":
        return (
          parseDateForSort(String(aValue)) - parseDateForSort(String(bValue))
        );

      case "dayOfWeek": {
        const normalize = (val: unknown) => {
          const str = String(val).toLowerCase();
          return shortToFull[str as keyof typeof shortToFull] || str;
        };

        const aDay = normalize(aValue);
        const bDay = normalize(bValue);

        return longWeekdays.indexOf(aDay) - longWeekdays.indexOf(bDay);
      }

      case "string":
        return String(aValue).localeCompare(String(bValue));

      default:
        return 0;
    }
  };
};

/**
 * Detects the type of a value for sorting and formatting.
 *
 * @param {unknown} value - The value to detect.
 * @returns {"number" | "id" | "percentage" | "currency" | "date" | "dayOfWeek" | "string"} The detected type.
 */
export const detectType = (
  value: unknown
):
  | "number"
  | "id"
  | "percentage"
  | "currency"
  | "date"
  | "dayOfWeek"
  | "string" => {
  if (typeof value === "number") return "number";
  if (value == null) return "string";

  const str = String(value).trim().toLowerCase();

  // % percentage
  if (/^\s*[+-]?\d+(\.\d+)?\s*%$/.test(str)) return "percentage";

  // Currency: check for common currency formats
  if (
    /^[$€£¥₹]\s*-?\s*\d+(\.\d+)?$/.test(str) || // Plain: $5000
    /^-?\s*\d+(\.\d+)?\s*[$€£¥₹]$/.test(str) || // Plain: 5000$
    /^[$€£¥₹]\s*-?\s*\d{1,3}(,\d{3})+(\.\d+)?$/.test(str) || // Intl: $1,000,000
    /^[$€£¥₹]\s*-?\s*\d{1,3}(,\d{2})+(,\d{3})*(\.\d+)?$/.test(str) || // Indian mixed: ₹3,00,000,000
    /^[$€£¥₹]\s*-?\s*\d{1,3}(,\d{2})+(\.\d+)?$/.test(str) || // Pure Indian: ₹3,50,000
    /^-?\s*\d{1,3}(,\d{3})+(\.\d+)?\s*[$€£¥₹]$/.test(str) || // Intl: 1,000,000$
    /^-?\s*\d{1,3}(,\d{2})+(,\d{3})*(\.\d+)?\s*[$€£¥₹]$/.test(str) || // Indian mixed: 3,00,000,000₹
    /^-?\s*\d{1,3}(,\d{2})+(\.\d+)?\s*[$€£¥₹]$/.test(str) // Pure Indian: 3,50,000₹
  ) {
    return "currency";
  }

  // ID: check for common ID formats
  if (/^#\d+$|^id-\d+$/i.test(str)) return "id";

  if (longWeekdays.includes(str) || shortWeekdays.includes(str)) {
    return "dayOfWeek";
  }

  // Date: check string looks like a date, and parses as one
  // First: match supported formats
  const ddmmyyyy = /^\s*(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})\s*$/;
  const iso = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
  const mmmDate = /^[A-Za-z]{3,9} \d{1,2},? \d{4}$/;

  const parts = str.match(ddmmyyyy);
  if (parts) {
    const dd = Number(parts[1]);
    const mm = Number(parts[2]);
    const yy = Number(parts[3]);
    const yyyy = yy < 100 ? (yy > 50 ? 1900 + yy : 2000 + yy) : yy;

    const parsed = new Date(yyyy, mm - 1, dd);
    if (
      parsed.getDate() === dd &&
      parsed.getMonth() === mm - 1 &&
      parsed.getFullYear() === yyyy
    ) {
      return "date";
    }
  } else if (iso.test(str) || mmmDate.test(str)) {
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return "date";
    }
  }

  // Numeric string
  if (/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(str)) return "number";

  return "string";
};

/**
 * Formats a number to a fixed number of decimal places.
 *
 * @param {number} num - The number to format.
 * @param {number} decimalPlaces - Number of decimal places.
 * @returns {string} The formatted string.
 */
export const formatValue = (num: number, decimalPlaces: number): string => {
  const factor = Math.pow(10, decimalPlaces);
  const rounded = Math.round((num + Number.EPSILON) * factor) / factor;
  return rounded.toFixed(decimalPlaces);
};

/**
 * Enhances columns with smart sorting, rendering, and filtering logic.
 *
 * @param {IntelligentTableColumnType[]} columns - The columns to enhance.
 * @returns {IntelligentTableColumnType[]} The enhanced columns.
 */
export const enhanceColumns = (
  columns: IntelligentTableColumnType[]
): IntelligentTableColumnType[] => {
  return columns.map((column) => {
    const isGroup =
      Array.isArray(column.children) && column.children.length > 0;

    const enhancedColumn: IntelligentTableColumnType = {
      ...column,
      children: isGroup ? enhanceColumns(column.children!) : undefined,
    };

    // Only enhance leaf columns
    if (!isGroup) {
      enhancedColumn.sorter = getSorter(column);

      // Add default render logic if render is undefined
      if (!column.render) {
        enhancedColumn.render = (text) => {
          let value = text;

          // Apply roundOff if value is number-like and roundOff is defined
          const type = detectType(value);
          if (
            column.roundOff !== undefined &&
            ["number", "percentage", "currency"].includes(type)
          ) {
            const parsed = parseNumericValue(value);
            if (parsed.number !== null) {
              value = `${type === "currency" ? parsed.symbol : ""}${formatValue(
                parsed.number,
                column.roundOff
              )}${type !== "currency" ? parsed.symbol : ""}`;
            }
          }

          if (column.colorConfig) {
            value = createIntelligentTableColoredText(
              value,
              column.colorConfig
            );
          }

          return value;
        };
      }

      // Add default onFilter logic on numeric colummns if filters are defined but onFilter is undefined
      if (column.filters && !column.onFilter) {
        enhancedColumn.onFilter = (filterValue, record) => {
          const recordVal = parseNumericValue(
            record[column.dataIndex as string]
          ).number;

          if (
            ["id", "number", "percentage", "currency"].includes(
              detectType(recordVal)
            )
          ) {
            if (recordVal == null) return false;

            if (typeof filterValue === "string" && filterValue.includes("-")) {
              const [min, max] = filterValue.split("-").map(Number);
              return recordVal >= min && recordVal <= max;
            }

            return recordVal === Number(filterValue);
          }
          return false;
        };
      }
    }

    return enhancedColumn;
  });
};

/**
 * Gets the most frequent symbol from an array of symbols.
 *
 * @param {string[]} symbols - Array of symbols.
 * @returns {string} The most frequent symbol.
 */
export const getMostFrequentSymbol = (symbols: string[]): string => {
  const freq: Record<string, number> = {};

  for (const symbol of symbols) {
    freq[symbol] = (freq[symbol] || 0) + 1;
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  return sorted[0]?.[0] || "";
};

/**
 * Parses a value to extract its numeric value and symbol (currency, percentage, etc).
 *
 * @param {unknown} value - The value to parse.
 * @returns {{ number: number | null; symbol: string }} The parsed number and symbol.
 */
export const parseNumericValue = (
  value: unknown
): { number: number | null; symbol: string } => {
  if (value == null) return { number: null, symbol: "" };

  const str = String(value).trim().replace(/,/g, "");
  const type = detectType(str);

  let num: number | null = null;
  let symbol = "";

  switch (type) {
    case "number":
      num = Number(str);
      break;

    case "percentage":
      num = parseFloat(str.replace("%", ""));
      symbol = "%";
      break;

    case "currency": {
      // Example: ₹200.50 or $1,000.00
      const currencyMatch = str.match(/([^0-9.-]*)-?[\d,.]+/);
      symbol = currencyMatch?.[1] || "";
      num = parseFloat(str.replace(/[^0-9.-]/g, ""));
      break;
    }

    case "id": {
      // Example: #123
      const idMatch = str.match(/([^0-9]*)\d+/);
      symbol = idMatch?.[1] || "";
      num = parseInt(str.replace(/[^0-9]/g, ""), 10);
      break;
    }

    default:
      num = null;
      break;
  }

  return { number: isNaN(num!) ? null : num, symbol };
};

/**
 * Recursively flattens columns to get all leaf columns.
 *
 * @param {IntelligentTableColumnType[]} columns - The columns to flatten.
 * @returns {IntelligentTableColumnType[]} Array of leaf columns.
 */
export const getLeafColumns = (
  columns: IntelligentTableColumnType[]
): IntelligentTableColumnType[] => {
  return columns.flatMap((col) =>
    col.children ? getLeafColumns(col.children) : [col]
  );
};

/**
 * Gets the value from a row by its dataIndex, supporting nested arrays.
 *
 * @param {AnyObject} row - The row object.
 * @param {DataIndex<AnyObject>} dataIndex - The dataIndex (string, number, or array).
 * @returns {unknown} The value at the given dataIndex.
 */
export function getValueByDataIndex(
  row: AnyObject,
  dataIndex: DataIndex<AnyObject>
): unknown {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce((acc: AnyObject, key) => {
      if (acc && key in acc) {
        return (acc as AnyObject)[key];
      }
      return undefined;
    }, row);
  }

  return row?.[dataIndex as keyof typeof row];
}
