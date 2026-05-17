// Archived one-off migration helper for T-604.
// Assumes the pre-externalization `problemSeeds` structure in src/data/problems.ts.
// Kept only for historical reference; do not use in the normal authoring workflow.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import YAML from 'yaml';

const CATEGORY_ORDER = [
  '基本構文',
  '条件分岐',
  '数値計算',
  'リスト操作',
  '文字列操作',
  'ループ',
  '高階関数',
  '再帰',
  'クロージャ',
];

const DIFFICULTY_ORDER = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const DEFAULT_ESTIMATED_MINUTES = {
  beginner: 6,
  intermediate: 10,
  advanced: 14,
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const problemsFilePath = path.join(repoRoot, 'src', 'data', 'problems.ts');
const contentRoot = path.join(repoRoot, 'src', 'content', 'problems');
const manifestPath = path.join(contentRoot, 'manifest.json');
const protectedProblemIds = new Set(['basic-01', 'basic-03', 'function-dispatch-01']);

function normalizeText(value) {
  return value.replace(/\r\n/g, '\n');
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  throw new Error(`未対応の property name です: ${name.getText()}`);
}

function evaluateNode(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isIdentifier(node) && node.text === 'undefined') {
    return undefined;
  }

  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    const value = Number(node.operand.text);

    switch (node.operator) {
      case ts.SyntaxKind.MinusToken:
        return -value;
      case ts.SyntaxKind.PlusToken:
        return value;
      default:
        break;
    }
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => evaluateNode(element));
  }

  if (ts.isObjectLiteralExpression(node)) {
    const result = {};

    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error(`未対応の object property です: ${property.getText()}`);
      }

      const propertyName = getPropertyName(property.name);
      result[propertyName] = evaluateNode(property.initializer);
    }

    return result;
  }

  throw new Error(`未対応の node です: ${ts.SyntaxKind[node.kind]} (${node.getText()})`);
}

function findProblemSeeds(sourceFile) {
  let foundProblemSeeds = null;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node)
      && ts.isIdentifier(node.name)
      && node.name.text === 'problemSeeds'
      && node.initializer
    ) {
      foundProblemSeeds = evaluateNode(node.initializer);
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!Array.isArray(foundProblemSeeds)) {
    throw new Error('problemSeeds を problems.ts から解決できませんでした');
  }

  return foundProblemSeeds;
}

function getCategoryIndex(category) {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function sortProblemSeeds(problemSeeds) {
  return problemSeeds
    .map((problem, originalIndex) => ({ problem, originalIndex }))
    .sort((left, right) => {
      const categoryDiff = getCategoryIndex(left.problem.category) - getCategoryIndex(right.problem.category);
      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      const difficultyDiff = DIFFICULTY_ORDER[left.problem.difficulty] - DIFFICULTY_ORDER[right.problem.difficulty];
      if (difficultyDiff !== 0) {
        return difficultyDiff;
      }

      return left.originalIndex - right.originalIndex;
    })
    .map(({ problem }) => problem);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function buildProblemMarkdown(problem) {
  const frontmatter = {
    id: problem.id,
    slug: problem.id,
    title: problem.title,
    category: problem.category,
    difficulty: problem.difficulty,
    estimatedMinutes: problem.estimatedMinutes ?? DEFAULT_ESTIMATED_MINUTES[problem.difficulty],
    learningGoals: problem.learningGoals ?? [problem.category],
    draft: false,
  };

  if (problem.hint) {
    frontmatter.hint = problem.hint;
  }

  return `---\n${YAML.stringify(frontmatter).trimEnd()}\n---\n\n${normalizeText(problem.description).trimEnd()}\n`;
}

async function main() {
  const rewriteExisting = process.argv.includes('--rewrite-existing');
  const problemsSource = await fs.readFile(problemsFilePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    problemsFilePath,
    problemsSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const legacyProblemSeeds = findProblemSeeds(sourceFile);
  const sortedProblemSeeds = sortProblemSeeds(legacyProblemSeeds);
  let createdProblemCount = 0;
  let skippedProblemCount = 0;

  await fs.mkdir(contentRoot, { recursive: true });

  for (const problem of sortedProblemSeeds) {
    const problemDirectory = path.join(contentRoot, problem.id);
    const directoryExists = await pathExists(problemDirectory);

    if (directoryExists && (!rewriteExisting || protectedProblemIds.has(problem.id))) {
      skippedProblemCount += 1;
      continue;
    }

    await fs.mkdir(problemDirectory, { recursive: true });
    await fs.writeFile(path.join(problemDirectory, 'problem.md'), buildProblemMarkdown(problem));
    await fs.writeFile(path.join(problemDirectory, 'starter.lisp'), normalizeText(problem.initialCode));
    await fs.writeFile(path.join(problemDirectory, 'solution.lisp'), normalizeText(problem.solution));
    await fs.writeFile(
      path.join(problemDirectory, 'judge.json'),
      `${JSON.stringify(problem.judge, null, 2)}\n`,
    );
    createdProblemCount += 1;
  }

  const manifest = {
    version: 1,
    problemOrder: sortedProblemSeeds.map((problem) => problem.id),
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`created=${createdProblemCount}`);
  console.log(`skipped=${skippedProblemCount}`);
  console.log(`total=${sortedProblemSeeds.length}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});