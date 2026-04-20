const STORAGE_KEY_CODE = 'lisp-playground-code';
const STORAGE_KEY_PROBLEM = 'lisp-playground-problem-id';

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
