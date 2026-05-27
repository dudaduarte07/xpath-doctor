import * as vscode from "vscode";
import { analyzeXPath } from "./analyzer";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("xpath-doctor.analyzeSelectedXPath", () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage("Abra um arquivo e selecione um XPath para analisar.");
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection).trim();

    if (!selectedText) {
      vscode.window.showWarningMessage("Selecione um XPath antes de rodar a análise.");
      return;
    }

    const analysis = analyzeXPath(cleanSelectedXPath(selectedText));

    const result = formatAnalysis(analysis);

    vscode.workspace.openTextDocument({
      content: result,
      language: "markdown"
    }).then((doc) => {
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function cleanSelectedXPath(text: string): string {
  return text
    .replace(/^["'`]/, "")
    .replace(/["'`]$/, "")
    .replace(/response\.xpath\(/, "")
    .replace(/selector\.xpath\(/, "")
    .replace(/\)\.get\(\)/, "")
    .replace(/\)\.getall\(\)/, "")
    .trim();
}

function formatAnalysis(analysis: ReturnType<typeof analyzeXPath>): string {
  return `# XPath Doctor Analysis

## Classificação

**${analysis.classification}**

Score: **${analysis.score}/100**

## XPath analisado

\`\`\`xpath
${analysis.xpath}
\`\`\`

## O que esse XPath faz

${analysis.explanation}

## Problemas encontrados

${analysis.problems.map((problem) => `- ${problem}`).join("\n")}

## Sugestões

${analysis.suggestions.map((suggestion) => `- ${suggestion}`).join("\n")}
`;
}