import { describe, it, expect } from 'vitest';
import { lispLanguage } from '../lisp-language';

describe('lispLanguage', () => {
  it('exports a valid StreamLanguage extension', () => {
    expect(lispLanguage).toBeDefined();
  });

  describe('tokenization via state machine', () => {
    // Access the stream parser from the StreamLanguage instance
    // StreamLanguage stores it as a property on the extension
    const parser = (lispLanguage as unknown as { streamParser: {
      startState: () => { depth: number };
      token: (stream: unknown, state: { depth: number }) => string | null;
    } }).streamParser;

    function tokenize(input: string): Array<{ text: string; type: string | null }> {
      const tokens: Array<{ text: string; type: string | null }> = [];
      const state = parser.startState();
      let pos = 0;

      while (pos < input.length) {
        const stream = {
          _pos: pos,
          _start: pos,
          eatSpace() {
            let consumed = false;
            while (this._pos < input.length && /\s/.test(input[this._pos])) {
              this._pos++;
              consumed = true;
            }
            return consumed;
          },
          match(pattern: string | RegExp): boolean {
            if (typeof pattern === 'string') {
              if (input.startsWith(pattern, this._pos)) {
                this._pos += pattern.length;
                return true;
              }
              return false;
            }
            const m = input.slice(this._pos).match(pattern);
            if (m && m.index === 0) {
              this._pos += m[0].length;
              return true;
            }
            return false;
          },
          skipToEnd() {
            this._pos = input.length;
          },
          next(): string | null {
            if (this._pos >= input.length) return null;
            return input[this._pos++];
          },
          eol(): boolean {
            return this._pos >= input.length;
          },
          current(): string {
            return input.slice(this._start, this._pos);
          },
        };

        const type = parser.token(stream, state);
        const text = input.slice(pos, stream._pos);
        if (stream._pos === pos) {
          // Avoid infinite loop
          pos++;
        } else {
          if (text.trim()) {
            tokens.push({ text, type });
          }
          pos = stream._pos;
        }
      }
      return tokens;
    }

    it('tokenizes comments', () => {
      const tokens = tokenize('; this is a comment');
      expect(tokens).toEqual([{ text: '; this is a comment', type: 'comment' }]);
    });

    it('tokenizes numbers', () => {
      const tokens = tokenize('42 -3 3.14');
      expect(tokens).toContainEqual({ text: '42', type: 'number' });
      expect(tokens).toContainEqual({ text: '-3', type: 'number' });
      expect(tokens).toContainEqual({ text: '3.14', type: 'number' });
    });

    it('tokenizes strings', () => {
      const tokens = tokenize('"hello world"');
      expect(tokens).toEqual([{ text: '"hello world"', type: 'string' }]);
    });

    it('tokenizes parentheses', () => {
      const tokens = tokenize('()');
      expect(tokens).toContainEqual({ text: '(', type: 'paren' });
      expect(tokens).toContainEqual({ text: ')', type: 'paren' });
    });

    it('tokenizes special forms as keywords', () => {
      const tokens = tokenize('(defun if let lambda cond)');
      const keywords = tokens.filter(t => t.type === 'keyword');
      expect(keywords.length).toBeGreaterThanOrEqual(4);
    });

    it('tokenizes builtins', () => {
      const tokens = tokenize('(print car cdr mapcar)');
      const builtins = tokens.filter(t => t.type === 'builtin');
      expect(builtins.length).toBeGreaterThanOrEqual(3);
    });

    it('tokenizes t and nil as atoms', () => {
      const tokens = tokenize('t nil');
      expect(tokens).toContainEqual({ text: 't', type: 'atom' });
      expect(tokens).toContainEqual({ text: 'nil', type: 'atom' });
    });

    it('tokenizes quote as keyword', () => {
      const tokens = tokenize("'(1 2 3)");
      expect(tokens[0]).toEqual({ text: "'", type: 'keyword' });
    });

    it('tokenizes function reference as keyword', () => {
      const tokens = tokenize("#'+");
      expect(tokens[0]).toEqual({ text: "#'", type: 'keyword' });
    });

    it('tokenizes dynamic variables specially', () => {
      const tokens = tokenize('*counter*');
      expect(tokens[0].type).toBe('variableName.special');
    });

    it('tokenizes regular symbols as variableName', () => {
      const tokens = tokenize('my-function');
      expect(tokens[0].type).toBe('variableName');
    });

    it('tracks paren depth', () => {
      const state = parser.startState();
      expect(state.depth).toBe(0);
    });
  });
});
