import type { AnyObject } from "antd/es/_util/type";
import { detectType, parseNumericValue } from "./helperFunctions";

/**
 * Aggregated & grouped node, ready for AntD table.
 */
export interface AggregatedNode extends AnyObject {
  key: string;
  totalValue: number;
  totalCount: number;
  averageValue: number;
  percentageOfParentRaw: number;
  percentageOfParent: string;
  percentageOfRootRaw: number;
  percentageOfRoot: string;
  children?: AggregatedNode[];
}

/**
 * Options to configure which fields are value/count in raw data.
 */
export interface AggregationConfig {
  valueField: string; // e.g., 'salesAmount'
  countField?: string; // e.g., 'transactions'
}

/**
 * Groups data by multiple keys recursively.
 */
export function groupByKeysWithKey(
  data: AnyObject[],
  keys: string[],
  config: AggregationConfig,
  parentKey: string = ""
): AggregatedNode[] {
  if (keys.length === 0) {
    return data.map((item, idx) => {
      const value = Number(item[config.valueField]) || 0;
      const count = config.countField
        ? Number(item[config.countField]) || 0
        : 0;
      return {
        key: parentKey ? `${parentKey}-${idx}` : `${idx}`,
        totalValue: value,
        totalCount: count,
        averageValue: count > 0 ? value / count : 0,
        percentageOfParentRaw: 1,
        percentageOfParent: "100%",
        percentageOfRootRaw: 1,
        percentageOfRoot: "100%",
        ...item,
      };
    });
  }

  const [firstKey, ...restKeys] = keys;
  const grouped: Record<string, AnyObject[]> = data.reduce((acc, item) => {
    const groupValue = item[firstKey];
    if (!acc[groupValue]) acc[groupValue] = [];
    acc[groupValue].push(item);
    return acc;
  }, {} as Record<string, AnyObject[]>);

  return Object.entries(grouped).map(([groupValue, items]) => {
    const nodeKey = parentKey ? `${parentKey}-${groupValue}` : `${groupValue}`;
    const node: AggregatedNode = {
      key: nodeKey,
      totalValue: 0,
      totalCount: 0,
      averageValue: 0,
      percentageOfParentRaw: 1,
      percentageOfParent: "100%",
      percentageOfRootRaw: 1,
      percentageOfRoot: "100%",
      [firstKey]: groupValue,
    };

    if (restKeys.length) {
      node.children = groupByKeysWithKey(items, restKeys, config, nodeKey);
    } else {
      node.children = items.map((leaf, idx) => {
        const value = Number(leaf[config.valueField]) || 0;
        const count = config.countField
          ? Number(leaf[config.countField]) || 0
          : 0;
        return {
          key: `${nodeKey}-${idx}`,
          totalValue: value,
          totalCount: count,
          averageValue: count > 0 ? value / count : 0,
          percentageOfParentRaw: 1,
          percentageOfParent: "100%",
          percentageOfRootRaw: 1,
          percentageOfRoot: "100%",
          ...leaf,
        };
      });
    }

    return node;
  });
}

/**
 * Recursively computes totals, averages, parent/root percentages.
 */
export function addAggregatesWithDerived(
  node: AggregatedNode,
  parentTotalValue?: number,
  rootTotalValue?: number
): AggregatedNode {
  if (node.children && node.children.length) {
    node.children = node.children.map((child) =>
      addAggregatesWithDerived(child)
    );

    const totals = node.children.reduce(
      (acc, child) => ({
        totalValue: acc.totalValue + child.totalValue,
        totalCount: acc.totalCount + child.totalCount,
      }),
      { totalValue: 0, totalCount: 0 }
    );

    node.totalValue = totals.totalValue;
    node.totalCount = totals.totalCount;
  }

  node.averageValue =
    node.totalCount > 0 ? node.totalValue / node.totalCount : 0;

  const rawParent =
    parentTotalValue && parentTotalValue > 0
      ? node.totalValue / parentTotalValue
      : 1;
  const rawRoot =
    rootTotalValue && rootTotalValue > 0 ? node.totalValue / rootTotalValue : 1;

  node.percentageOfParentRaw = rawParent;
  node.percentageOfParent = `${rawParent * 100}%`;
  node.percentageOfRootRaw = rawRoot;
  node.percentageOfRoot = `${rawRoot * 100}%`;

  if (node.children && node.children.length) {
    node.children = node.children.map((child) =>
      addAggregatesWithDerived(
        child,
        node.totalValue,
        rootTotalValue ?? node.totalValue
      )
    );
  }

  return node;
}

/**
 * Recursively sorts children arrays in tree.
 */
export function sortGroups(
  node: AggregatedNode,
  compareFn: (a: AggregatedNode, b: AggregatedNode) => number
): AggregatedNode {
  if (node.children && node.children.length) {
    node.children = node.children.map((child) => sortGroups(child, compareFn));
    node.children = node.children.sort(compareFn);
  }
  return node;
}

/**
 * Pivot flat data into wide rows: rowKey → pivotKey values → valueField.
 */
export interface PivotOptions {
  rowKey: string;
  pivotKey: string;
  valueField: string;
  transformValue?: (value: unknown, item: AnyObject) => unknown;
  addAverageField?: boolean;
  orderedPivotKeys?: string[];
}

export function pivotData(
  data: AnyObject[],
  options: PivotOptions
): AnyObject[] {
  const {
    rowKey,
    pivotKey,
    valueField,
    transformValue,
    addAverageField,
    orderedPivotKeys,
  } = options;

  const grouped: Record<string | number, AnyObject> = {};

  data.forEach((item) => {
    const rowVal = item[rowKey];
    const colKey = String(item[pivotKey]);
    const value = transformValue
      ? transformValue(item[valueField], item)
      : item[valueField];
    if (!grouped[rowVal]) {
      grouped[rowVal] = { [rowKey]: rowVal };
    }
    grouped[rowVal][colKey] = value;
  });

  let rows: AnyObject[] = Object.values(grouped).map((row, index) => ({
    key: index,
    ...row,
  }));

  if (addAverageField) {
    rows = rows.map((row) => {
      // Use orderedPivotKeys if provided, else all keys except rowKey & key
      const pivotFields =
        orderedPivotKeys ??
        Object.keys(row).filter((k) => k !== rowKey && k !== "key");

      const numericValues = pivotFields
        .map((field) => {
          const cell = row[field];
          const type = detectType(cell);
          if (
            type === "percentage" ||
            type === "number" ||
            type === "currency"
          ) {
            return {
              number: parseNumericValue(cell).number,
              symbol: parseNumericValue(cell).symbol,
              type: type,
            };
          }
        })
        .filter((num) => typeof num?.number === "number" && !isNaN(num.number));

      const avg = {
        number:
          numericValues.reduce(
            (sum, v) =>
              v?.number !== null && v?.number !== undefined
                ? sum + v.number
                : 0,
            0
          ) / numericValues.length,
        symbol: numericValues[0]?.symbol,
        type: numericValues[0]?.type,
      };

      const formattedAvg =
        avg.type === "currency"
          ? `${avg.symbol}${avg.number}`
          : `${avg.number}${avg.symbol}`;

      return { ...row, average: formattedAvg };
    });
  }

  return rows;
}

/**
 * Functional pipeline: apply transformations. Compose multiple transform steps.
 */
export function transformPipeline(
  data: AnyObject[],
  steps: ((data: AnyObject[]) => AnyObject[])[]
): AnyObject[] {
  return steps.reduce((result, step) => step(result), data);
}

/**
 * Filter flat array.
 */
export function filterData(
  data: AnyObject[],
  predicate: (item: AnyObject) => boolean
): AnyObject[] {
  return data.filter(predicate);
}

/**
 * Sort flat array.
 */
export function sortData(
  data: AnyObject[],
  compareFn: (a: AnyObject, b: AnyObject) => number
): AnyObject[] {
  return [...data].sort(compareFn);
}
