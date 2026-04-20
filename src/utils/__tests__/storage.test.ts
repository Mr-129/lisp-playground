// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveCode, loadCode, saveProblemId, loadProblemId } from '../storage';

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
});
