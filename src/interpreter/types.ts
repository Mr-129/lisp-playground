// Common Lisp value types

export type LispValue =
  | LispNumber
  | LispString
  | LispSymbol
  | LispList
  | LispNil
  | LispT
  | LispFunction
  | LispLambda;

export interface LispNumber {
  type: 'number';
  value: number;
}

export interface LispString {
  type: 'string';
  value: string;
}

export interface LispSymbol {
  type: 'symbol';
  name: string;
}

export interface LispList {
  type: 'list';
  elements: LispValue[];
}

export interface LispNil {
  type: 'nil';
}

export interface LispT {
  type: 't';
}

export interface LispFunction {
  type: 'function';
  name: string;
  fn: (args: LispValue[], env: Environment) => LispValue;
}

export interface LispLambda {
  type: 'lambda';
  params: string[];
  body: LispValue[];
  closure: Environment;
  name?: string;
}

export interface Environment {
  vars: Map<string, LispValue>;
  parent: Environment | null;
}

// Helper constructors
export const NIL: LispNil = { type: 'nil' };
export const T: LispT = { type: 't' };

export function makeNumber(value: number): LispNumber {
  return { type: 'number', value };
}

export function makeString(value: string): LispString {
  return { type: 'string', value };
}

export function makeSymbol(name: string): LispSymbol {
  return { type: 'symbol', name: name.toUpperCase() };
}

export function makeList(elements: LispValue[]): LispList | LispNil {
  if (elements.length === 0) return NIL;
  return { type: 'list', elements };
}

export function isTruthy(val: LispValue): boolean {
  return val.type !== 'nil';
}

export function isEqual(a: LispValue, b: LispValue): boolean {
  if (a.type === 'nil' && b.type === 'nil') return true;
  if (a.type === 't' && b.type === 't') return true;
  if (a.type === 'number' && b.type === 'number') return a.value === b.value;
  if (a.type === 'string' && b.type === 'string') return a.value === b.value;
  if (a.type === 'symbol' && b.type === 'symbol') return a.name === b.name;
  if (a.type === 'list' && b.type === 'list') {
    if (a.elements.length !== b.elements.length) return false;
    return a.elements.every((el, i) => isEqual(el, b.elements[i]));
  }
  return false;
}

export function printValue(val: LispValue): string {
  switch (val.type) {
    case 'number': return String(val.value);
    case 'string': return `"${val.value}"`;
    case 'symbol': return val.name;
    case 'nil': return 'NIL';
    case 't': return 'T';
    case 'list': return `(${val.elements.map(printValue).join(' ')})`;
    case 'function': return `#<FUNCTION ${val.name}>`;
    case 'lambda': return `#<FUNCTION (LAMBDA)${val.name ? ` ${val.name}` : ''}>`;
  }
}
