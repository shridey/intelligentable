import type { CSSProperties } from "react";
import type { IntelligentTableLegendCircleType } from "./IntelligentTableLegendCircleType";
import type { IntelligentTableLegendLabelType } from "./IntelligentTableLegendLabelType";

export interface IntelligentTableLegendStyleType
  extends Pick<CSSProperties, "backgroundColor" | "border"> {
  circle?: IntelligentTableLegendCircleType;
  label?: IntelligentTableLegendLabelType;
}
