import { detectType, parseNumericValue } from "./helperFunctions";
import type { IntelligentTableColorConfigType } from "../../types/IntelligentTable/IntelligentTableColorConfigType";

/**
 * Determines the color for a cell value based on provided color configuration rules.
 *
 * @param {IntelligentTableColorConfigType[]} configs - Array of color configuration rules.
 * @param {number | string | null | undefined} value - The cell value to evaluate.
 * @returns {string | undefined} The color to apply, or undefined if no rule matches.
 */
export const getColor = (
  configs: IntelligentTableColorConfigType[],
  value: number | string | null | undefined
): string | undefined => {
  if (!Array.isArray(configs)) return undefined;
  if (value == null) return undefined;

  const type = detectType(value);

  for (const config of configs) {
    if (config.color === undefined) continue;

    // === STRING / DATE / DAY-OF-WEEK ===
    if (type === "string" || type === "date" || type === "dayOfWeek") {
      // Regex match
      if (config.regEx) {
        try {
          const regex = new RegExp(config.regEx, "i"); // default: case-insensitive
          if (regex.test(String(value))) return config.color;
        } catch (e) {
          console.warn("Invalid regex pattern:", config.regEx);
          console.error(e);
          continue;
        }
      }

      // Exact / includes match
      else if (config.str !== undefined) {
        const inputStr = String(value).toLowerCase();
        const configStr = config.str.toLowerCase();

        if (config.exactMatch) {
          if (inputStr === configStr) return config.color;
        } else {
          if (inputStr.includes(configStr)) return config.color;
        }
      }

      continue;
    }

    // === NUMERIC TYPES ===
    if (
      type === "number" ||
      type === "currency" ||
      type === "id" ||
      type === "percentage"
    ) {
      if (config.min === undefined && config.max === undefined) continue;

      const parsed = parseNumericValue(value);
      const numericValue = parsed.number;

      if (numericValue == null) continue;

      const min = config.min ?? -Infinity;
      const max = config.max ?? Infinity;

      // Exact match
      if (min === max) {
        if (numericValue === min) return config.color;
        continue;
      }

      // Range match
      const meetsMin =
        config.inclusiveMin !== false
          ? numericValue >= min
          : numericValue > min;
      const meetsMax =
        config.inclusiveMax === true ? numericValue <= max : numericValue < max;

      if (meetsMin && meetsMax) return config.color;
    }
  }

  return undefined;
};

/**
 * Renders a span element with colored text based on color configuration rules.
 *
 * @param {string | number} value - The cell value to display.
 * @param {IntelligentTableColorConfigType[]} colorConfig - Array of color configuration rules.
 * @returns {JSX.Element} A span element with the appropriate text color applied.
 */
export const createIntelligentTableColoredText = (
  value: string | number,
  colorConfig: IntelligentTableColorConfigType[]
) => {
  const color = getColor(colorConfig, value);

  return (
    <span
      style={{
        color: color,
      }}
    >
      {value}
    </span>
  );
};
