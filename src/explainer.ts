export function explainXPath(xpath: string): string {
  const cleanXPath = xpath.trim();

  if (!cleanXPath) {
    return "Nenhum XPath foi selecionado.";
  }

  const parts: string[] = [];

  if (cleanXPath.startsWith("//")) {
    parts.push("Procura elementos em qualquer lugar do HTML.");
  } else if (cleanXPath.startsWith("/")) {
    parts.push("Percorre o HTML a partir da raiz da página.");
  }

  if (cleanXPath.includes("//a")) {
    parts.push("Busca links representados pela tag <a>.");
  }

  if (cleanXPath.includes("//img")) {
    parts.push("Busca imagens representadas pela tag <img>.");
  }

  if (cleanXPath.includes("//h1")) {
    parts.push("Busca títulos principais da página, usando a tag <h1>.");
  }

  if (cleanXPath.includes("//h2")) {
    parts.push("Busca subtítulos ou títulos de seção, usando a tag <h2>.");
  }

  if (cleanXPath.includes("text()")) {
    parts.push("Extrai o texto do elemento encontrado.");
  }

  const attrMatch = cleanXPath.match(/@([a-zA-Z-]+)/);
  if (attrMatch) {
    parts.push(`Extrai ou filtra usando o atributo ${attrMatch[1]}.`);
  }

  if (cleanXPath.includes("contains(@class")) {
    parts.push("Filtra elementos que contêm uma classe específica.");
  }

  if (cleanXPath.includes("@id")) {
    parts.push("Usa o atributo id, que normalmente é mais estável quando existe.");
  }

  if (cleanXPath.includes("normalize-space")) {
    parts.push("Remove espaços extras antes de comparar ou extrair o conteúdo.");
  }

  if (parts.length === 0) {
    return "Esse XPath seleciona elementos do HTML conforme a estrutura informada.";
  }

  return parts.join(" ");
}