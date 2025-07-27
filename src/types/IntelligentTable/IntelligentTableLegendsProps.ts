import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableLegendStyleType } from "@/types/IntelligentTable/IntelligentTableLegendStyleType";

/**
 * Props for rendering legends in IntelligentTable.
 *
 * @property {IntelligentTableColumnType[]} columns - The columns configuration for which legends are generated.
 * @property {IntelligentTableLegendStyleType} [legendStyle] - Optional style configuration for the legends.
 */
export type IntelligentTableLegendsProps = {
  columns: IntelligentTableColumnType[];
  legendStyle?: IntelligentTableLegendStyleType;
};
