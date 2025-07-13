import type { ThemeConfig } from "antd";
import type { IntelligentTableLegendStyleType } from "./IntelligentTableLegendStyleType";

interface IntelligentTableSearchInputStyle
  extends Pick<
    NonNullable<NonNullable<ThemeConfig["components"]>["Input"]>,
    | "colorText"
    | "colorBorder"
    | "activeBg"
    | "activeBorderColor"
    | "hoverBg"
    | "hoverBorderColor"
  > {
  placeholderText?: string | undefined;
}

export interface IntelligentTableThemeConfigType
  extends NonNullable<NonNullable<ThemeConfig["components"]>["Table"]> {
  defaultSummaryRow?: Pick<
    React.CSSProperties,
    "color" | "backgroundColor" | "fontWeight"
  >;
  legends?: IntelligentTableLegendStyleType;
  searchBox?: IntelligentTableSearchInputStyle;
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
