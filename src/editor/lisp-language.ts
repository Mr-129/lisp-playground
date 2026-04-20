import { StreamLanguage } from '@codemirror/language';

const lispSpecialForms = new Set([
  'defun', 'defvar', 'defparameter', 'lambda', 'let', 'let*',
  'if', 'cond', 'when', 'unless', 'and', 'or', 'not',
  'progn', 'setq', 'setf', 'quote', 'function',
  'funcall', 'apply', 'dotimes', 'dolist', 'loop', 'return',
]);

const lispBuiltins = new Set([
  'print', 'princ', 'terpri', 'format',
  'car', 'cdr', 'first', 'rest', 'second', 'third', 'nth',
  'cons', 'list', 'append', 'length', 'reverse', 'last',
  'member', 'remove', 'assoc', 'sort',
  'mapcar', 'remove-if', 'remove-if-not', 'reduce', 'some', 'every',
  'concatenate', 'string-upcase', 'string-downcase', 'subseq',
  'string=', 'write-to-string', 'parse-integer',
  'numberp', 'stringp', 'symbolp', 'listp', 'consp', 'atom', 'null', 'functionp',
  'eq', 'eql', 'equal',
  'zerop', 'plusp', 'minusp', 'evenp', 'oddp',
  'abs', 'max', 'min', 'floor', 'ceiling', 'round', 'sqrt', 'expt',
  'mod', '1+', '1-',
  'make-counter',
]);

export const lispLanguage = StreamLanguage.define({
  startState() {
    return { depth: 0 };
  },

  token(stream, state) {
    // Whitespace
    if (stream.eatSpace()) return null;

    // Comment
    if (stream.match(';')) {
      stream.skipToEnd();
      return 'comment';
    }

    // String
    if (stream.match('"')) {
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '\\') {
          stream.next();
        } else if (ch === '"') {
          return 'string';
        }
      }
      return 'string';
    }

    // Number
    if (stream.match(/^-?\d+(\.\d+)?/)) {
      return 'number';
    }

    // Quote shorthand
    if (stream.match("'") || stream.match('#\'')) {
      return 'keyword';
    }

    // Parens
    if (stream.match('(')) {
      state.depth++;
      return 'paren';
    }
    if (stream.match(')')) {
      state.depth--;
      return 'paren';
    }

    // T and NIL literals
    if (stream.match(/^(t|nil)\b/i)) {
      return 'atom';
    }

    // Symbol/keyword
    if (stream.match(/^[^\s();'"]+/)) {
      const word = stream.current().toLowerCase();
      if (lispSpecialForms.has(word)) return 'keyword';
      if (lispBuiltins.has(word)) return 'builtin';
      if (word.startsWith('*') && word.endsWith('*')) return 'variableName.special';
      if (word.startsWith(':')) return 'atom';
      return 'variableName';
    }

    stream.next();
    return null;
  },
});
