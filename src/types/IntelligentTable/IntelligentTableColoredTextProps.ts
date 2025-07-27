import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";

/**
 * Props for rendering colored text in IntelligentTable cells.
 *
 * @property {string | number | undefined} value - The cell value to display and evaluate for coloring.
 * @property {IntelligentTableColorConfigType[]} colorConfig - Array of color configuration rules to determine the cell's text color.
 */
export type IntelligentTableColoredTextProps = {
  value: string | number | undefined;
  colorConfig: IntelligentTableColorConfigType[];
};
