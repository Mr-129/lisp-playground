import { parse as parseYaml } from 'yaml';
import { ZodError } from 'zod';
import type { ProblemSeed } from './problemCatalog';
import { judgeSpecSchema, problemManifestSchema, problemMarkdownFrontmatterSchema, type ProblemManifest } from './problemContentSchema';

interface TextFileEntry {
  path: string;
  text: string;
}

interface JsonFileEntry {
  path: string;
  data: unknown;
}

export interface ProblemContentSourceSet {
  manifest: unknown;
  markdownFiles: Record<string, string>;
  starterFiles: Record<string, string>;
  solutionFiles: Record<string, string>;
  judgeFiles: Record<string, unknown>;
}

const EMPTY_MANIFEST: ProblemManifest = {
  version: 1,
  problemOrder: [],
};

const manifestModules = import.meta.glob('../content/problems/manifest.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

const markdownModules = import.meta.glob('../content/problems/*/problem.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const starterModules = import.meta.glob('../content/problems/*/starter.lisp', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const solutionModules = import.meta.glob('../content/problems/*/solution.lisp', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const judgeModules = import.meta.glob('../content/problems/*/judge.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function normalizeTextContent(text: string): string {
  return text.replace(/\r\n/g, '\n');
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('\n');
}

function getProblemIdFromPath(filePath: string, fileName: string): string {
  const normalizedPath = normalizePath(filePath);
  const suffix = `/${fileName}`;

  if (!normalizedPath.endsWith(suffix)) {
    throw new Error(`想定外のファイルパスです: ${filePath}`);
  }

  const directoryPath = normalizedPath.slice(0, -suffix.length);
  const problemId = directoryPath.split('/').pop();

  if (!problemId) {
    throw new Error(`問題 ID をファイルパスから解決できません: ${filePath}`);
  }

  return problemId;
}

function indexTextFiles(files: Record<string, string>, fileName: string): Map<string, TextFileEntry> {
  const indexedFiles = new Map<string, TextFileEntry>();

  for (const [filePath, text] of Object.entries(files)) {
    const problemId = getProblemIdFromPath(filePath, fileName);

    if (indexedFiles.has(problemId)) {
      throw new Error(`${fileName} が重複しています: ${problemId}`);
    }

    indexedFiles.set(problemId, {
      path: normalizePath(filePath),
      text: normalizeTextContent(text),
    });
  }

  return indexedFiles;
}

function indexJsonFiles(files: Record<string, unknown>, fileName: string): Map<string, JsonFileEntry> {
  const indexedFiles = new Map<string, JsonFileEntry>();

  for (const [filePath, data] of Object.entries(files)) {
    const problemId = getProblemIdFromPath(filePath, fileName);

    if (indexedFiles.has(problemId)) {
      throw new Error(`${fileName} が重複しています: ${problemId}`);
    }

    indexedFiles.set(problemId, {
      path: normalizePath(filePath),
      data,
    });
  }

  return indexedFiles;
}

function parseManifest(source: unknown): ProblemManifest {
  const result = problemManifestSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`manifest.json が不正です\n${formatZodError(result.error)}`);
  }

  return result.data;
}

function parseProblemMarkdown(markdown: string, filePath: string) {
  const normalizedMarkdown = normalizeTextContent(markdown);

  if (!normalizedMarkdown.startsWith('---\n')) {
    throw new Error(`${filePath}: frontmatter は先頭の --- で開始してください`);
  }

  const frontmatterEndIndex = normalizedMarkdown.indexOf('\n---\n', 4);

  if (frontmatterEndIndex === -1) {
    throw new Error(`${filePath}: frontmatter の終了 --- が見つかりません`);
  }

  const frontmatterBlock = normalizedMarkdown.slice(4, frontmatterEndIndex);
  const description = normalizedMarkdown
    .slice(frontmatterEndIndex + '\n---\n'.length)
    .replace(/^\n+/, '')
    .replace(/\n+$/, '');

  if (!description) {
    throw new Error(`${filePath}: 問題本文が空です`);
  }

  let parsedFrontmatter: unknown;

  try {
    parsedFrontmatter = parseYaml(frontmatterBlock);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${filePath}: frontmatter の YAML 解析に失敗しました\n${message}`);
  }

  const result = problemMarkdownFrontmatterSchema.safeParse(parsedFrontmatter);

  if (!result.success) {
    throw new Error(`${filePath}: frontmatter が不正です\n${formatZodError(result.error)}`);
  }

  return {
    frontmatter: result.data,
    description,
  };
}

function parseJudgeSpec(source: unknown, filePath: string) {
  const result = judgeSpecSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`${filePath}: judge.json が不正です\n${formatZodError(result.error)}`);
  }

  return result.data;
}

function validateProblemFileCoverage(
  manifest: ProblemManifest,
  markdownFiles: Map<string, TextFileEntry>,
  starterFiles: Map<string, TextFileEntry>,
  solutionFiles: Map<string, TextFileEntry>,
  judgeFiles: Map<string, JsonFileEntry>
) {
  const manifestProblemIds = new Set(manifest.problemOrder);
  const discoveredProblemIds = new Set<string>([
    ...markdownFiles.keys(),
    ...starterFiles.keys(),
    ...solutionFiles.keys(),
    ...judgeFiles.keys(),
  ]);

  for (const problemId of manifest.problemOrder) {
    if (!markdownFiles.has(problemId)) {
      throw new Error(`manifest.json にある問題 ${problemId} の problem.md が見つかりません`);
    }
    if (!starterFiles.has(problemId)) {
      throw new Error(`manifest.json にある問題 ${problemId} の starter.lisp が見つかりません`);
    }
    if (!solutionFiles.has(problemId)) {
      throw new Error(`manifest.json にある問題 ${problemId} の solution.lisp が見つかりません`);
    }
    if (!judgeFiles.has(problemId)) {
      throw new Error(`manifest.json にある問題 ${problemId} の judge.json が見つかりません`);
    }
  }

  for (const problemId of discoveredProblemIds) {
    if (!manifestProblemIds.has(problemId)) {
      throw new Error(`問題フォルダ ${problemId} は存在しますが manifest.json に未登録です`);
    }
  }
}

export function loadProblemContentFromSources(sourceSet: ProblemContentSourceSet): ProblemSeed[] {
  const manifest = parseManifest(sourceSet.manifest);
  const markdownFiles = indexTextFiles(sourceSet.markdownFiles, 'problem.md');
  const starterFiles = indexTextFiles(sourceSet.starterFiles, 'starter.lisp');
  const solutionFiles = indexTextFiles(sourceSet.solutionFiles, 'solution.lisp');
  const judgeFiles = indexJsonFiles(sourceSet.judgeFiles, 'judge.json');
  const manifestProblemIds = new Set(manifest.problemOrder);
  const seenSlugs = new Set<string>();

  validateProblemFileCoverage(manifest, markdownFiles, starterFiles, solutionFiles, judgeFiles);

  return manifest.problemOrder.map((problemId) => {
    const markdownFile = markdownFiles.get(problemId);
    const starterFile = starterFiles.get(problemId);
    const solutionFile = solutionFiles.get(problemId);
    const judgeFile = judgeFiles.get(problemId);

    if (!markdownFile || !starterFile || !solutionFile || !judgeFile) {
      throw new Error(`問題 ${problemId} のファイルが不足しています`);
    }

    const { frontmatter, description } = parseProblemMarkdown(markdownFile.text, markdownFile.path);

    if (frontmatter.id !== problemId) {
      throw new Error(`${markdownFile.path}: frontmatter.id (${frontmatter.id}) が manifest の ID (${problemId}) と一致しません`);
    }

    if (seenSlugs.has(frontmatter.slug)) {
      throw new Error(`${markdownFile.path}: slug が重複しています (${frontmatter.slug})`);
    }

    if (frontmatter.slug !== problemId && manifestProblemIds.has(frontmatter.slug)) {
      throw new Error(`${markdownFile.path}: slug が別問題の id と衝突しています (${frontmatter.slug})`);
    }

    seenSlugs.add(frontmatter.slug);

    const judge = parseJudgeSpec(judgeFile.data, judgeFile.path);

    return {
      id: frontmatter.id,
      slug: frontmatter.slug,
      title: frontmatter.title,
      category: frontmatter.category,
      difficulty: frontmatter.difficulty,
      description,
      hint: frontmatter.hint,
      initialCode: starterFile.text,
      solution: solutionFile.text,
      judge,
      estimatedMinutes: frontmatter.estimatedMinutes,
      learningGoals: frontmatter.learningGoals,
    } satisfies ProblemSeed;
  });
}

export function loadExternalProblemSeeds(): ProblemSeed[] {
  const manifests = Object.values(manifestModules);

  if (manifests.length > 1) {
    throw new Error('manifest.json が複数検出されました');
  }

  return loadProblemContentFromSources({
    manifest: manifests[0] ?? EMPTY_MANIFEST,
    markdownFiles: markdownModules,
    starterFiles: starterModules,
    solutionFiles: solutionModules,
    judgeFiles: judgeModules,
  });
}