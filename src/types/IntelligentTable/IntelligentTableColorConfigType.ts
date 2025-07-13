import type { CSSProperties } from "react";

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
