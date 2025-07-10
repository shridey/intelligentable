import type { IntelligentTableLegendsProps } from "@/types/IntelligentTable/IntelligentTableLegendsProps";
import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableLegendType } from "@/types/IntelligentTable/IntelligentTableLegendType";
import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";

const extractLegends = (
  columns: IntelligentTableColumnType[]
): IntelligentTableLegendType[] => {
  const legendSet = new Map<string, IntelligentTableLegendType>();

  const isThresholdRule = (entry: IntelligentTableColorConfigType) =>
    "min" in entry || "max" in entry;

  const isStringRule = (entry: IntelligentTableColorConfigType) =>
    "str" in entry || "regEx" in entry;

  const collectLegends = (col: IntelligentTableColumnType): void => {
    if (Array.isArray(col.colorConfig)) {
      col.colorConfig.forEach((entry) => {
        const color = entry.color as string;

        let key = "";
        let label = "";

        // Threshold-based
        if (isThresholdRule(entry)) {
          const { min, max, inclusiveMin = true, inclusiveMax = false } = entry;

          key = `threshold-${min ?? "-∞"}-${
            max ?? "∞"
          }-${inclusiveMin}-${inclusiveMax}-${color}`;

          const minSymbol = inclusiveMin ? "≥" : ">";
          const maxSymbol = inclusiveMax ? "≤" : "<";

          if (min != null && max != null && min === max) {
            label = `= ${min}`;
          } else if (min != null && max != null) {
            label = `${minSymbol} ${min} & ${maxSymbol} ${max}`;
          } else if (min != null) {
            label = `${minSymbol} ${min}`;
          } else if (max != null) {
            label = `${maxSymbol} ${max}`;
          } else {
            label = "All values";
          }

          legendSet.set(key, { label, color });
        }

        // String-based
        if (isStringRule(entry)) {
          if (entry.str) {
            key = `str-${entry.str}-${entry.exactMatch}-${color}`;
            label = entry.exactMatch ? `= "${entry.str}"` : `~ "${entry.str}"`;
          } else if (entry.regEx) {
            key = `regex-${entry.regEx}-${color}`;
            label = `= RegEx /${entry.regEx}/`;
          }

          if (key) {
            legendSet.set(key, { label, color });
          }
        }
      });
    }

    if (Array.isArray(col.children)) {
      col.children.forEach(collectLegends);
    }
  };

  columns?.forEach(collectLegends);
  return Array.from(legendSet.values());
};

export const IntelligentTableLegends = ({
  columns = [],
  legendStyle = {},
}: IntelligentTableLegendsProps) => {
  const legends = extractLegends(columns);

  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        padding: 6,
        border: legendStyle?.border || "1px solid #d9d9d9",
        borderRadius: 6,
        backgroundColor: legendStyle?.backgroundColor,
      }}
    >
      {legends.map((item, idx) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            key={idx}
          >
            <svg
              width={(legendStyle?.circle?.radius as number) * 2 || 12}
              height={(legendStyle?.circle?.radius as number) * 2 || 12}
            >
              <circle
                cx={legendStyle?.circle?.radius || 6}
                cy={legendStyle?.circle?.radius || 6}
                r={legendStyle?.circle?.radius || 6}
                fill={item.color}
              />
            </svg>
            <span
              style={{
                fontSize: legendStyle?.label?.fontSize || 14,
                fontWeight: legendStyle?.label?.fontWeight,
                fontFamily: legendStyle?.label?.fontFamily,
                color: legendStyle?.label?.color,
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
