export type XPathClassification = "BOM" | "REGULAR" | "FÁCIL DE QUEBRAR";

export interface XPathAnalysis {
  xpath: string;
  score: number;
  classification: XPathClassification;
  explanation: string;
  problems: string[];
  suggestions: string[];
}