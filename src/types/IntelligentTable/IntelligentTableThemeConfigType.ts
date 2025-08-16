import type { ThemeConfig } from "antd";
import type { IntelligentTableLegendStyleType } from "./IntelligentTableLegendStyleType";

/**
 * Theme configuration for customizing the appearance of IntelligentTable components.
 *
 * @extends NonNullable<NonNullable<ThemeConfig["components"]>["Table"]>
 * @property {Pick<React.CSSProperties, "color" | "backgroundColor" | "fontWeight">} [defaultSummaryRow] - Style configuration for the summary row.
 * @property {IntelligentTableLegendStyleType} [legends] - Style configuration for table legends.
 * @property {IntelligentTableSearchInputStyle} [searchBox] - Style configuration for the search input box.
 * @property {Pick<NonNullable<NonNullable<ThemeConfig["components"]>["Button"]>, "defaultBg" | "defaultColor" | "defaultHoverBg" | "defaultHoverColor" | "defaultBorderColor" | "defaultHoverBorderColor">} [exportButton] - Style configuration for the export button.
 * @property {Pick<NonNullable<NonNullable<ThemeConfig["components"]>["Dropdown"]>, "colorText" | "colorBgElevated" | "controlItemBgHover">} [exportButtonDropdown] - Style configuration for the export button dropdown.
 */
export interface IntelligentTableThemeConfigType
  extends NonNullable<NonNullable<ThemeConfig["components"]>["Table"]> {
  defaultSummaryRow?: Pick<
    React.CSSProperties,
    "color" | "backgroundColor" | "fontWeight"
  >;
  legends?: IntelligentTableLegendStyleType;
  searchBox?: Pick<
    NonNullable<NonNullable<ThemeConfig["components"]>["Input"]>,
    | "colorText"
    | "colorBorder"
    | "activeBg"
    | "activeBorderColor"
    | "hoverBg"
    | "hoverBorderColor"
  >;
  exportButton?: Pick<
    NonNullable<NonNullable<ThemeConfig["components"]>["Button"]>,
    | "defaultBg"
    | "defaultColor"
    | "defaultHoverBg"
    | "defaultHoverColor"
    | "defaultBorderColor"
    | "defaultHoverBorderColor"
  >;
  exportButtonDropdown?: Pick<
    NonNullable<NonNullable<ThemeConfig["components"]>["Dropdown"]>,
    "colorText" | "colorBgElevated" | "controlItemBgHover"
  >;
}
