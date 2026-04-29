// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveCode,
  loadCode,
  saveProblemId,
  loadProblemId,
  saveSolvedProblemIds,
  loadSolvedProblemIds,
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
});
