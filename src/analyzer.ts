import { XPathAnalysis, XPathClassification } from "./types";
import { explainXPath } from "./explainer";

export function analyzeXPath(xpath: string): XPathAnalysis {
  const cleanXPath = xpath.trim();

  let score = 100;
  const problems: string[] = [];
  const suggestions: string[] = [];

  if (!cleanXPath) {
    return {
      xpath: cleanXPath,
      score: 0,
      classification: "FÁCIL DE QUEBRAR",
      explanation: "Nenhum XPath foi selecionado.",
      problems: ["Seleção vazia."],
      suggestions: ["Selecione um XPath válido no editor."]
    };
  }

  if (cleanXPath.startsWith("/html") || cleanXPath.startsWith("/body")) {
    score -= 35;
    problems.push("Usa caminho absoluto começando por /html ou /body.");
    suggestions.push("Evite caminhos absolutos. Prefira seletores relativos com // e atributos estáveis.");
  }

  const indexMatches = cleanXPath.match(/\[\d+\]/g) || [];
  if (indexMatches.length >= 1) {
    score -= indexMatches.length * 12;
    problems.push(`Usa ${indexMatches.length} índice(s) fixo(s), como [1], [2] ou [3].`);
    suggestions.push("Evite depender de posição fixa. Use atributos como @id, @class, @href ou contains().");
  }

  const divCount = (cleanXPath.match(/\/div/g) || []).length;
  if (divCount >= 3) {
    score -= 20;
    problems.push("Usa muitas tags div em sequência.");
    suggestions.push("Tente encontrar uma tag mais semântica ou um atributo próximo do dado desejado.");
  }

  if (cleanXPath.length > 90) {
    score -= 15;
    problems.push("XPath muito longo.");
    suggestions.push("XPaths longos tendem a ser mais difíceis de manter e mais fáceis de quebrar.");
  }

  if (/\/\/(div|span|p|section|article)(\/|$|\[)/.test(cleanXPath) && !cleanXPath.includes("@")) {
    score -= 15;
    problems.push("XPath genérico demais, sem uso de atributos.");
    suggestions.push("Use atributos para tornar o seletor mais específico.");
  }

  if (cleanXPath.includes('@class="') || cleanXPath.includes("@class='")) {
    score -= 5;
    problems.push("Usa comparação exata de classe.");
    suggestions.push("Prefira contains(@class, 'nome-da-classe') para reduzir quebra por múltiplas classes.");
  }

  if (cleanXPath.includes("contains(@class")) {
    score += 10;
  }

  if (cleanXPath.includes("@id")) {
    score += 12;
  }

  if (cleanXPath.includes("normalize-space")) {
    score += 6;
  }

  if (!cleanXPath.includes("text()") && !/@[a-zA-Z-]+/.test(cleanXPath)) {
    score -= 8;
    problems.push("O XPath não deixa claro se quer texto ou atributo.");
    suggestions.push("Finalize com text(), @href, @src ou outro atributo quando fizer sentido.");
  }

  score = Math.max(0, Math.min(100, score));

  const classification = classifyScore(score);

  if (problems.length === 0) {
    problems.push("Nenhum problema relevante detectado.");
  }

  if (suggestions.length === 0) {
    suggestions.push("XPath parece adequado. Ainda assim, valide com exemplos reais de HTML.");
  }

  return {
    xpath: cleanXPath,
    score,
    classification,
    explanation: explainXPath(cleanXPath),
    problems,
    suggestions
  };
}

function classifyScore(score: number): XPathClassification {
  if (score >= 75) {
    return "BOM";
  }

  if (score >= 45) {
    return "REGULAR";
  }

  return "FÁCIL DE QUEBRAR";
}