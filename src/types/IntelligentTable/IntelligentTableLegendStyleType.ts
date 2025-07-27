import type { CSSProperties } from "react";
import type { IntelligentTableLegendCircleType } from "./IntelligentTableLegendCircleType";
import type { IntelligentTableLegendLabelType } from "./IntelligentTableLegendLabelType";

/**
 * Style configuration for IntelligentTable legends.
 *
 * @extends Pick<CSSProperties, "backgroundColor" | "border">
 * @property {IntelligentTableLegendCircleType} [circle] - Configuration for the legend circle.
 * @property {IntelligentTableLegendLabelType} [label] - Configuration for the legend label.
 */
export interface IntelligentTableLegendStyleType
  extends Pick<CSSProperties, "backgroundColor" | "border"> {
  circle?: IntelligentTableLegendCircleType;
  label?: IntelligentTableLegendLabelType;
}
