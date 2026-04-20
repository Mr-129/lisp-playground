import { LispValue, makeNumber, makeString, makeSymbol, NIL } from './types';

export interface Token {
  type: 'lparen' | 'rparen' | 'number' | 'string' | 'symbol' | 'quote' | 'backquote' | 'comma' | 'sharp-quote';
  value: string;
  line: number;
  col: number;
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  while (i < source.length) {
    const ch = source[i];

    // Whitespace
    if (/\s/.test(ch)) {
      if (ch === '\n') { line++; col = 1; } else { col++; }
      i++;
      continue;
    }

    // Comment
    if (ch === ';') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }

    // Left paren
    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(', line, col });
      i++; col++;
      continue;
    }

    // Right paren
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')', line, col });
      i++; col++;
      continue;
    }

    // Sharp-quote #'
    if (ch === '#' && i + 1 < source.length && source[i + 1] === "'") {
      tokens.push({ type: 'sharp-quote', value: "#'", line, col });
      i += 2; col += 2;
      continue;
    }

    // Quote
    if (ch === "'") {
      tokens.push({ type: 'quote', value: "'", line, col });
      i++; col++;
      continue;
    }

    // String
    if (ch === '"') {
      let str = '';
      i++; col++;
      while (i < source.length && source[i] !== '"') {
        if (source[i] === '\\' && i + 1 < source.length) {
          i++; col++;
          const esc = source[i];
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else if (esc === '\\') str += '\\';
          else if (esc === '"') str += '"';
          else str += esc;
        } else {
          if (source[i] === '\n') { line++; col = 0; }
          str += source[i];
        }
        i++; col++;
      }
      if (i >= source.length) throw new Error(`文字列が閉じられていません (行 ${line})`);
      i++; col++;
      tokens.push({ type: 'string', value: str, line, col });
      continue;
    }

    // Number or symbol
    if (isAtomChar(ch)) {
      let atom = '';
      const startCol = col;
      while (i < source.length && isAtomChar(source[i])) {
        atom += source[i];
        i++; col++;
      }
      // Check if number
      if (/^[+-]?\d+(\.\d+)?$/.test(atom)) {
        tokens.push({ type: 'number', value: atom, line, col: startCol });
      } else {
        tokens.push({ type: 'symbol', value: atom, line, col: startCol });
      }
      continue;
    }

    throw new Error(`不明な文字 '${ch}' (行 ${line}, 列 ${col})`);
  }

  return tokens;
}

const ATOM_BREAK_CHARS = new Set([' ', '\t', '\n', '\r', '(', ')', "'", '"', ';']);

function isAtomChar(ch: string): boolean {
  return !ATOM_BREAK_CHARS.has(ch);
}

export function parse(tokens: Token[]): LispValue[] {
  let pos = 0;

  function parseExpr(): LispValue {
    if (pos >= tokens.length) {
      throw new Error('予期しない入力の終わり');
    }

    const token = tokens[pos];

    if (token.type === 'quote') {
      pos++;
      const expr = parseExpr();
      return { type: 'list', elements: [makeSymbol('QUOTE'), expr] };
    }

    if (token.type === 'sharp-quote') {
      pos++;
      const expr = parseExpr();
      return { type: 'list', elements: [makeSymbol('FUNCTION'), expr] };
    }

    if (token.type === 'lparen') {
      pos++;
      const elements: LispValue[] = [];
      while (pos < tokens.length && tokens[pos].type !== 'rparen') {
        elements.push(parseExpr());
      }
      if (pos >= tokens.length) {
        throw new Error(`括弧が閉じられていません (行 ${token.line})`);
      }
      pos++; // skip rparen
      if (elements.length === 0) return NIL;
      return { type: 'list', elements };
    }

    if (token.type === 'rparen') {
      throw new Error(`予期しない ')' (行 ${token.line}, 列 ${token.col})`);
    }

    pos++;

    if (token.type === 'number') {
      return makeNumber(parseFloat(token.value));
    }

    if (token.type === 'string') {
      return makeString(token.value);
    }

    if (token.type === 'symbol') {
      const upper = token.value.toUpperCase();
      if (upper === 'NIL') return NIL;
      if (upper === 'T') return { type: 't' };
      return makeSymbol(upper);
    }

    throw new Error(`不明なトークン: ${token.value}`);
  }

  const expressions: LispValue[] = [];
  while (pos < tokens.length) {
    expressions.push(parseExpr());
  }
  return expressions;
}

export function readFromString(source: string): LispValue[] {
  const tokens = tokenize(source);
  return parse(tokens);
}
