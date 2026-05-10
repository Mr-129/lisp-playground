const STORAGE_KEY_CODE = 'lisp-playground-code';
const STORAGE_KEY_PROBLEM = 'lisp-playground-problem-id';
const STORAGE_KEY_SOLVED_PROBLEMS = 'lisp-playground-solved-problem-ids';
const STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS = 'lisp-playground-recently-viewed-problem-ids';
const STORAGE_KEY_BOOKMARKED_PROBLEMS = 'lisp-playground-bookmarked-problem-ids';
const STORAGE_KEY_REPL_SESSION = 'lisp-playground-repl-session';

export interface ReplHistoryEntry {
  id: number;
  input: string;
  output: string;
  returnValue: string;
  error?: string;
}

export interface ReplSessionSnapshot {
  entries: ReplHistoryEntry[];
  inputHistory: string[];
  draftInput: string;
}

function isReplHistoryEntry(value: unknown): value is ReplHistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    Number.isFinite(candidate.id) &&
    typeof candidate.input === 'string' &&
    typeof candidate.output === 'string' &&
    typeof candidate.returnValue === 'string' &&
    (candidate.error === undefined || typeof candidate.error === 'string')
  );
}

function saveStringArray(key: string, values: string[]): void {
  try {
    const uniqueValues = Array.from(new Set(values));
    localStorage.setItem(key, JSON.stringify(uniqueValues));
  } catch {
    // ignore
  }
}

function loadStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

export function saveCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CODE, code);
  } catch {
    // localStorage unavailable or quota exceeded — ignore silently
  }
}

export function loadCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_CODE);
  } catch {
    return null;
  }
}

export function saveProblemId(id: string | null): void {
  try {
    if (id === null) {
      localStorage.removeItem(STORAGE_KEY_PROBLEM);
    } else {
      localStorage.setItem(STORAGE_KEY_PROBLEM, id);
    }
  } catch {
    // ignore
  }
}

export function loadProblemId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_PROBLEM);
  } catch {
    return null;
  }
}

export function saveSolvedProblemIds(ids: string[]): void {
  saveStringArray(STORAGE_KEY_SOLVED_PROBLEMS, ids);
}

export function loadSolvedProblemIds(): string[] {
  return loadStringArray(STORAGE_KEY_SOLVED_PROBLEMS);
}

export function saveRecentlyViewedProblemIds(ids: string[]): void {
  saveStringArray(STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS, ids);
}

export function loadRecentlyViewedProblemIds(): string[] {
  return loadStringArray(STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS);
}

export function saveBookmarkedProblemIds(ids: string[]): void {
  saveStringArray(STORAGE_KEY_BOOKMARKED_PROBLEMS, ids);
}

export function loadBookmarkedProblemIds(): string[] {
  return loadStringArray(STORAGE_KEY_BOOKMARKED_PROBLEMS);
}

export function saveReplSession(session: ReplSessionSnapshot): void {
  try {
    if (session.entries.length === 0 && session.inputHistory.length === 0 && session.draftInput === '') {
      localStorage.removeItem(STORAGE_KEY_REPL_SESSION);
      return;
    }

    localStorage.setItem(STORAGE_KEY_REPL_SESSION, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function loadReplSession(): ReplSessionSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPL_SESSION);
    if (raw === null) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;

    if (!Array.isArray(candidate.entries) || !Array.isArray(candidate.inputHistory) || typeof candidate.draftInput !== 'string') {
      return null;
    }

    const entries = candidate.entries.filter(isReplHistoryEntry);
    if (entries.length !== candidate.entries.length) {
      return null;
    }

    const inputHistory = candidate.inputHistory.filter((value): value is string => typeof value === 'string');
    if (inputHistory.length !== candidate.inputHistory.length) {
      return null;
    }

    return {
      entries,
      inputHistory,
      draftInput: candidate.draftInput,
    };
  } catch {
    return null;
  }
}

export function clearReplSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_REPL_SESSION);
  } catch {
    // ignore
  }
}
