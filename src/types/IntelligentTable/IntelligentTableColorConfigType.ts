import type { CSSProperties } from "react";

/**
 * Configuration for dynamic cell coloring in IntelligentTable columns.
 *
 * @extends Pick<CSSProperties, "color">
 * @property {number} [min] - Minimum value for numeric range matching.
 * @property {number} [max] - Maximum value for numeric range matching.
 * @property {boolean} [inclusiveMin] - Whether the minimum value is inclusive.
 * @property {boolean} [inclusiveMax] - Whether the maximum value is inclusive.
 * @property {string} [str] - String value to match for coloring.
 * @property {string} [regEx] - Regular expression pattern to match for coloring.
 * @property {boolean} [exactMatch] - If true, only exact matches will apply the color.
 * @property {string} [color] - CSS color to apply to the cell.
 */
export interface IntelligentTableColorConfigType
  extends Pick<CSSProperties, "color"> {
  min?: number | undefined;
  max?: number | undefined;
  inclusiveMin?: boolean;
  inclusiveMax?: boolean;
  str?: string | undefined;
  regEx?: string | undefined;
  exactMatch?: boolean;
}
