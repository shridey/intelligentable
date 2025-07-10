import type { IntelligentTableColorConfigType } from "@/types/IntelligentTable/IntelligentTableColorConfigType";

export type IntelligentTableColoredTextProps = {
  value: string | number | undefined;
  colorConfig: IntelligentTableColorConfigType[];
};
