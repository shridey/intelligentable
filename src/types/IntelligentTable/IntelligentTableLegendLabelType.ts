import type { CSSProperties } from "react";

/**
 * Configuration for the legend label styling in IntelligentTable legends.
 *
 * @type {Object} IntelligentTableLegendLabelType
 * @property {string} [color] - Text color of the legend label.
 * @property {string | number} [fontSize] - Font size of the legend label.
 * @property {string | number} [fontWeight] - Font weight of the legend label.
 * @property {string} [fontFamily] - Font family of the legend label.
 */
export type IntelligentTableLegendLabelType = Pick<
  CSSProperties,
  "color" | "fontSize" | "fontWeight" | "fontFamily"
>;
