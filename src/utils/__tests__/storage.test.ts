// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveCode,
  loadCode,
  saveProblemId,
  loadProblemId,
  saveSolvedProblemIds,
  loadSolvedProblemIds,
  saveRecentlyViewedProblemIds,
  loadRecentlyViewedProblemIds,
  saveBookmarkedProblemIds,
  loadBookmarkedProblemIds,
  saveReplSession,
  loadReplSession,
  clearReplSession,
} from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveCode / loadCode', () => {
    it('saves and loads code', () => {
      saveCode('(+ 1 2)');
      expect(loadCode()).toBe('(+ 1 2)');
    });

    it('returns null when no code is saved', () => {
      expect(loadCode()).toBeNull();
    });

    it('overwrites previously saved code', () => {
      saveCode('(+ 1 2)');
      saveCode('(* 3 4)');
      expect(loadCode()).toBe('(* 3 4)');
    });

    it('handles empty string', () => {
      saveCode('');
      expect(loadCode()).toBe('');
    });

    it('handles localStorage unavailable gracefully on save', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveCode('test')).not.toThrow();
      spy.mockRestore();
    });

    it('handles localStorage unavailable gracefully on load', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadCode()).toBeNull();
      spy.mockRestore();
    });
  });

  describe('saveProblemId / loadProblemId', () => {
    it('saves and loads a problem ID', () => {
      saveProblemId('basic-01');
      expect(loadProblemId()).toBe('basic-01');
    });

    it('returns null when no problem ID is saved', () => {
      expect(loadProblemId()).toBeNull();
    });

    it('removes problem ID when null is passed', () => {
      saveProblemId('basic-01');
      saveProblemId(null);
      expect(loadProblemId()).toBeNull();
    });

    it('handles localStorage unavailable gracefully on save', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveProblemId('test')).not.toThrow();
      spy.mockRestore();
    });

    it('handles localStorage unavailable gracefully on load', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadProblemId()).toBeNull();
      spy.mockRestore();
    });
  });

  describe('saveSolvedProblemIds / loadSolvedProblemIds', () => {
    it('saves and loads solved problem IDs', () => {
      saveSolvedProblemIds(['basic-01', 'cond-01']);
      expect(loadSolvedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('returns an empty array when no solved problem IDs are saved', () => {
      expect(loadSolvedProblemIds()).toEqual([]);
    });

    it('deduplicates solved problem IDs when saving', () => {
      saveSolvedProblemIds(['basic-01', 'basic-01', 'cond-01']);
      expect(loadSolvedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('ignores invalid JSON data', () => {
      localStorage.setItem('lisp-playground-solved-problem-ids', '{invalid json');
      expect(loadSolvedProblemIds()).toEqual([]);
    });

    it('ignores non-array JSON data', () => {
      localStorage.setItem('lisp-playground-solved-problem-ids', JSON.stringify({ id: 'basic-01' }));
      expect(loadSolvedProblemIds()).toEqual([]);
    });

    it('filters out non-string entries', () => {
      localStorage.setItem(
        'lisp-playground-solved-problem-ids',
        JSON.stringify(['basic-01', 123, null, 'cond-01'])
      );
      expect(loadSolvedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('handles localStorage unavailable gracefully on save', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveSolvedProblemIds(['basic-01'])).not.toThrow();
      spy.mockRestore();
    });

    it('handles localStorage unavailable gracefully on load', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadSolvedProblemIds()).toEqual([]);
      spy.mockRestore();
    });
  });

  describe('saveRecentlyViewedProblemIds / loadRecentlyViewedProblemIds', () => {
    it('saves and loads recently viewed problem IDs', () => {
      saveRecentlyViewedProblemIds(['basic-01', 'cond-01']);
      expect(loadRecentlyViewedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('deduplicates recently viewed problem IDs when saving', () => {
      saveRecentlyViewedProblemIds(['basic-01', 'cond-01', 'basic-01']);
      expect(loadRecentlyViewedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('returns an empty array for invalid recently viewed data', () => {
      localStorage.setItem('lisp-playground-recently-viewed-problem-ids', '{invalid json');
      expect(loadRecentlyViewedProblemIds()).toEqual([]);
    });

    it('handles localStorage unavailable gracefully for recently viewed IDs', () => {
      const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveRecentlyViewedProblemIds(['basic-01'])).not.toThrow();
      setSpy.mockRestore();

      const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadRecentlyViewedProblemIds()).toEqual([]);
      getSpy.mockRestore();
    });
  });

  describe('saveBookmarkedProblemIds / loadBookmarkedProblemIds', () => {
    it('saves and loads bookmarked problem IDs', () => {
      saveBookmarkedProblemIds(['basic-01', 'cond-01']);
      expect(loadBookmarkedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('deduplicates bookmarked problem IDs when saving', () => {
      saveBookmarkedProblemIds(['basic-01', 'basic-01', 'cond-01']);
      expect(loadBookmarkedProblemIds()).toEqual(['basic-01', 'cond-01']);
    });

    it('returns an empty array for invalid bookmarked data', () => {
      localStorage.setItem('lisp-playground-bookmarked-problem-ids', JSON.stringify({ id: 'basic-01' }));
      expect(loadBookmarkedProblemIds()).toEqual([]);
    });

    it('handles localStorage unavailable gracefully for bookmarked IDs', () => {
      const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveBookmarkedProblemIds(['basic-01'])).not.toThrow();
      setSpy.mockRestore();

      const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadBookmarkedProblemIds()).toEqual([]);
      getSpy.mockRestore();
    });
  });

  describe('saveReplSession / loadReplSession / clearReplSession', () => {
    const session = {
      entries: [
        { id: 1, input: '(defvar *x* 42)', output: '', returnValue: '*X*' },
        { id: 2, input: '*x*', output: '', returnValue: '42' },
      ],
      inputHistory: ['(defvar *x* 42)', '*x*'],
      draftInput: '(+ 1 2)',
    };

    it('saves and loads REPL session snapshots', () => {
      saveReplSession(session);
      expect(loadReplSession()).toEqual(session);
    });

    it('returns null when REPL session data is invalid', () => {
      localStorage.setItem('lisp-playground-repl-session', JSON.stringify({ entries: [{}] }));
      expect(loadReplSession()).toBeNull();
    });

    it('removes REPL session when cleared explicitly', () => {
      saveReplSession(session);
      clearReplSession();
      expect(loadReplSession()).toBeNull();
    });

    it('removes REPL session when saving an empty snapshot', () => {
      saveReplSession(session);
      saveReplSession({ entries: [], inputHistory: [], draftInput: '' });
      expect(loadReplSession()).toBeNull();
    });

    it('handles localStorage unavailable gracefully for REPL session', () => {
      const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveReplSession(session)).not.toThrow();
      setSpy.mockRestore();

      const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(loadReplSession()).toBeNull();
      getSpy.mockRestore();

      const removeSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(() => clearReplSession()).not.toThrow();
      removeSpy.mockRestore();
    });
  });
});
