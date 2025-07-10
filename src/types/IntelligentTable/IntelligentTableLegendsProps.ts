import type { IntelligentTableColumnType } from "@/types/IntelligentTable/IntelligentTableColumnType";
import type { IntelligentTableLegendStyleType } from "@/types/IntelligentTable/IntelligentTableLegendStyleType";

export type IntelligentTableLegendsProps = {
  columns: IntelligentTableColumnType[];
  legendStyle?: IntelligentTableLegendStyleType;
};
