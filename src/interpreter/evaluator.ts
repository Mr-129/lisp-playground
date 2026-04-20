import {
  LispValue, NIL, T, makeNumber, makeString, makeList,
  isTruthy, isEqual, printValue, Environment,
} from './types';
import { createEnv, envGet, envSet, envUpdate } from './environment';

export type OutputFn = (text: string) => void;

const MAX_DEPTH = 1000;
let evaluationDepth = 0;

export function resetEvaluationDepth(): void {
  evaluationDepth = 0;
}

export function evaluate(expr: LispValue, env: Environment, output: OutputFn): LispValue {
  if (++evaluationDepth > MAX_DEPTH) {
    evaluationDepth = 0;
    throw new Error('再帰が深すぎます（最大深度 1000 を超えました）');
  }
  try {
    return evaluateInner(expr, env, output);
  } finally {
    evaluationDepth--;
  }
}

function evaluateInner(expr: LispValue, env: Environment, output: OutputFn): LispValue {
  switch (expr.type) {
    case 'number':
    case 'string':
    case 'nil':
    case 't':
    case 'function':
    case 'lambda':
      return expr;

    case 'symbol': {
      const val = envGet(env, expr.name);
      if (val === undefined) {
        throw new Error(`未定義の変数: ${expr.name}`);
      }
      return val;
    }

    case 'list':
      return evalList(expr.elements, env, output);
  }
}

function evalList(elements: LispValue[], env: Environment, output: OutputFn): LispValue {
  if (elements.length === 0) return NIL;

  const head = elements[0];

  // Special forms
  if (head.type === 'symbol') {
    switch (head.name) {
      case 'QUOTE':
        return elements[1] ?? NIL;

      case 'IF': {
        const condition = evaluate(elements[1], env, output);
        if (isTruthy(condition)) {
          return evaluate(elements[2], env, output);
        } else {
          return elements[3] ? evaluate(elements[3], env, output) : NIL;
        }
      }

      case 'COND': {
        for (let i = 1; i < elements.length; i++) {
          const clause = elements[i];
          if (clause.type !== 'list') throw new Error('condの各節はリストである必要があります');
          const test = evaluate(clause.elements[0], env, output);
          if (isTruthy(test)) {
            let result: LispValue = test;
            for (let j = 1; j < clause.elements.length; j++) {
              result = evaluate(clause.elements[j], env, output);
            }
            return result;
          }
        }
        return NIL;
      }

      case 'WHEN': {
        const test = evaluate(elements[1], env, output);
        if (isTruthy(test)) {
          let result: LispValue = NIL;
          for (let i = 2; i < elements.length; i++) {
            result = evaluate(elements[i], env, output);
          }
          return result;
        }
        return NIL;
      }

      case 'UNLESS': {
        const test = evaluate(elements[1], env, output);
        if (!isTruthy(test)) {
          let result: LispValue = NIL;
          for (let i = 2; i < elements.length; i++) {
            result = evaluate(elements[i], env, output);
          }
          return result;
        }
        return NIL;
      }

      case 'AND': {
        let result: LispValue = T;
        for (let i = 1; i < elements.length; i++) {
          result = evaluate(elements[i], env, output);
          if (!isTruthy(result)) return NIL;
        }
        return result;
      }

      case 'OR': {
        for (let i = 1; i < elements.length; i++) {
          const result = evaluate(elements[i], env, output);
          if (isTruthy(result)) return result;
        }
        return NIL;
      }

      case 'NOT': {
        const val = evaluate(elements[1], env, output);
        return isTruthy(val) ? NIL : T;
      }

      case 'PROGN': {
        let result: LispValue = NIL;
        for (let i = 1; i < elements.length; i++) {
          result = evaluate(elements[i], env, output);
        }
        return result;
      }

      case 'LET': {
        const bindings = elements[1];
        if (bindings.type !== 'list' && bindings.type !== 'nil')
          throw new Error('letの束縛リストが不正です');
        const newEnv = createEnv(env);
        if (bindings.type === 'list') {
          for (const binding of bindings.elements) {
            if (binding.type === 'symbol') {
              envSet(newEnv, binding.name, NIL);
            } else if (binding.type === 'list' && binding.elements.length >= 1) {
              const name = binding.elements[0];
              if (name.type !== 'symbol') throw new Error('letの変数名はシンボルである必要があります');
              const val = binding.elements[1] ? evaluate(binding.elements[1], env, output) : NIL;
              envSet(newEnv, name.name, val);
            }
          }
        }
        let result: LispValue = NIL;
        for (let i = 2; i < elements.length; i++) {
          result = evaluate(elements[i], newEnv, output);
        }
        return result;
      }

      case 'LET*': {
        const bindings = elements[1];
        if (bindings.type !== 'list' && bindings.type !== 'nil')
          throw new Error('let*の束縛リストが不正です');
        const newEnv = createEnv(env);
        if (bindings.type === 'list') {
          for (const binding of bindings.elements) {
            if (binding.type === 'symbol') {
              envSet(newEnv, binding.name, NIL);
            } else if (binding.type === 'list' && binding.elements.length >= 1) {
              const name = binding.elements[0];
              if (name.type !== 'symbol') throw new Error('let*の変数名はシンボルである必要があります');
              const val = binding.elements[1] ? evaluate(binding.elements[1], newEnv, output) : NIL;
              envSet(newEnv, name.name, val);
            }
          }
        }
        let result: LispValue = NIL;
        for (let i = 2; i < elements.length; i++) {
          result = evaluate(elements[i], newEnv, output);
        }
        return result;
      }

      case 'SETQ':
      case 'SETF': {
        let result: LispValue = NIL;
        for (let i = 1; i < elements.length; i += 2) {
          const sym = elements[i];
          if (sym.type !== 'symbol') throw new Error('setqの対象はシンボルである必要があります');
          const val = evaluate(elements[i + 1], env, output);
          if (!envUpdate(env, sym.name, val)) {
            envSet(env, sym.name, val);
          }
          result = val;
        }
        return result;
      }

      case 'DEFVAR':
      case 'DEFPARAMETER': {
        const sym = elements[1];
        if (sym.type !== 'symbol') throw new Error('defvarの対象はシンボルである必要があります');
        if (head.name === 'DEFVAR' && envGet(env, sym.name) !== undefined) {
          return sym;
        }
        const val = elements[2] ? evaluate(elements[2], env, output) : NIL;
        envSet(env, sym.name, val);
        return sym;
      }

      case 'DEFUN': {
        const name = elements[1];
        if (name.type !== 'symbol') throw new Error('defunの関数名はシンボルである必要があります');
        const params = elements[2];
        if (params.type !== 'list' && params.type !== 'nil')
          throw new Error('defunのパラメータリストが不正です');
        const paramNames = params.type === 'list'
          ? params.elements.map(p => {
              if (p.type !== 'symbol') throw new Error('パラメータはシンボルである必要があります');
              return p.name;
            })
          : [];
        const body = elements.slice(3);
        const lambda: LispValue = {
          type: 'lambda',
          params: paramNames,
          body,
          closure: env,
          name: name.name,
        };
        envSet(env, name.name, lambda);
        return name;
      }

      case 'LAMBDA': {
        const params = elements[1];
        if (params.type !== 'list' && params.type !== 'nil')
          throw new Error('lambdaのパラメータリストが不正です');
        const paramNames = params.type === 'list'
          ? params.elements.map(p => {
              if (p.type !== 'symbol') throw new Error('パラメータはシンボルである必要があります');
              return p.name;
            })
          : [];
        const body = elements.slice(2);
        return {
          type: 'lambda' as const,
          params: paramNames,
          body,
          closure: env,
        };
      }

      case 'FUNCALL': {
        const fn = evaluate(elements[1], env, output);
        const args = elements.slice(2).map(a => evaluate(a, env, output));
        return applyFn(fn, args, env, output);
      }

      case 'APPLY': {
        const fn = evaluate(elements[1], env, output);
        const lastArg = evaluate(elements[elements.length - 1], env, output);
        const middleArgs = elements.slice(2, -1).map(a => evaluate(a, env, output));
        const listArgs = lastArg.type === 'list' ? lastArg.elements : lastArg.type === 'nil' ? [] : [lastArg];
        return applyFn(fn, [...middleArgs, ...listArgs], env, output);
      }

      case 'FUNCTION': {
        const arg = elements[1];
        if (arg.type === 'symbol') {
          const val = envGet(env, arg.name);
          if (!val) throw new Error(`未定義の関数: ${arg.name}`);
          return val;
        }
        if (arg.type === 'list' && arg.elements[0]?.type === 'symbol' && arg.elements[0].name === 'LAMBDA') {
          return evaluate(arg, env, output);
        }
        throw new Error('#functionの引数が不正です');
      }

      case 'DOTIMES': {
        const spec = elements[1];
        if (spec.type !== 'list') throw new Error('dotimesの指定が不正です');
        const varSym = spec.elements[0];
        if (varSym.type !== 'symbol') throw new Error('dotimesの変数はシンボルである必要があります');
        const countVal = evaluate(spec.elements[1], env, output);
        if (countVal.type !== 'number') throw new Error('dotimesの回数は数値である必要があります');
        const resultExpr = spec.elements[2];
        const newEnv = createEnv(env);
        for (let i = 0; i < countVal.value; i++) {
          envSet(newEnv, varSym.name, makeNumber(i));
          for (let j = 2; j < elements.length; j++) {
            evaluate(elements[j], newEnv, output);
          }
        }
        envSet(newEnv, varSym.name, makeNumber(countVal.value));
        return resultExpr ? evaluate(resultExpr, newEnv, output) : NIL;
      }

      case 'DOLIST': {
        const spec = elements[1];
        if (spec.type !== 'list') throw new Error('dolistの指定が不正です');
        const varSym = spec.elements[0];
        if (varSym.type !== 'symbol') throw new Error('dolistの変数はシンボルである必要があります');
        const listVal = evaluate(spec.elements[1], env, output);
        const resultExpr = spec.elements[2];
        const items = listVal.type === 'list' ? listVal.elements : [];
        const newEnv = createEnv(env);
        for (const item of items) {
          envSet(newEnv, varSym.name, item);
          for (let j = 2; j < elements.length; j++) {
            evaluate(elements[j], newEnv, output);
          }
        }
        envSet(newEnv, varSym.name, NIL);
        return resultExpr ? evaluate(resultExpr, newEnv, output) : NIL;
      }

      case 'LOOP': {
        // Simple infinite loop with RETURN support
        const body = elements.slice(1);
        const sentinel = Symbol('return');
        let returnValue: LispValue = NIL;
        const loopEnv = createEnv(env);
        // Add RETURN as a special function
        envSet(loopEnv, 'RETURN', {
          type: 'function',
          name: 'RETURN',
          fn: (args: LispValue[]) => {
            returnValue = args[0] ?? NIL;
            throw sentinel;
          },
        });
        try {
          let iterations = 0;
          const MAX_ITERATIONS = 100000;
          while (true) {
            if (++iterations > MAX_ITERATIONS) {
              throw new Error('無限ループを検出しました（最大反復回数を超えました）');
            }
            for (const expr of body) {
              evaluate(expr, loopEnv, output);
            }
          }
        } catch (e) {
          if (e === sentinel) return returnValue;
          throw e;
        }
      }
    }
  }

  // Function call
  const fn = evaluate(head, env, output);
  const args = elements.slice(1).map(a => evaluate(a, env, output));
  return applyFn(fn, args, env, output);
}

function applyFn(fn: LispValue, args: LispValue[], env: Environment, output: OutputFn): LispValue {
  if (fn.type === 'function') {
    return fn.fn(args, env);
  }

  if (fn.type === 'lambda') {
    const callEnv = createEnv(fn.closure);
    // Handle &rest parameter
    const restIndex = fn.params.indexOf('&REST');
    if (restIndex !== -1) {
      for (let i = 0; i < restIndex; i++) {
        envSet(callEnv, fn.params[i], args[i] ?? NIL);
      }
      const restArgs = args.slice(restIndex);
      envSet(callEnv, fn.params[restIndex + 1], makeList(restArgs) ?? NIL);
    } else {
      for (let i = 0; i < fn.params.length; i++) {
        envSet(callEnv, fn.params[i], args[i] ?? NIL);
      }
    }
    let result: LispValue = NIL;
    for (const bodyExpr of fn.body) {
      result = evaluate(bodyExpr, callEnv, output);
    }
    return result;
  }

  throw new Error(`${printValue(fn)} は関数ではありません`);
}

// Built-in functions
export function createGlobalEnv(output: OutputFn): Environment {
  const env = createEnv();

  // Arithmetic
  const defBuiltin = (name: string, fn: (args: LispValue[], env: Environment) => LispValue) => {
    envSet(env, name, { type: 'function', name, fn });
  };

  defBuiltin('+', (args) => {
    const sum = args.reduce((acc, a) => {
      if (a.type !== 'number') throw new Error(`+: 数値が期待されますが ${printValue(a)} が渡されました`);
      return acc + a.value;
    }, 0);
    return makeNumber(sum);
  });

  defBuiltin('-', (args) => {
    if (args.length === 0) throw new Error('-: 引数が必要です');
    if (args[0].type !== 'number') throw new Error(`-: 数値が期待されます`);
    if (args.length === 1) return makeNumber(-args[0].value);
    let result = args[0].value;
    for (let i = 1; i < args.length; i++) {
      const a = args[i];
      if (a.type !== 'number') throw new Error(`-: 数値が期待されます`);
      result -= a.value;
    }
    return makeNumber(result);
  });

  defBuiltin('*', (args) => {
    const product = args.reduce((acc, a) => {
      if (a.type !== 'number') throw new Error(`*: 数値が期待されます`);
      return acc * a.value;
    }, 1);
    return makeNumber(product);
  });

  defBuiltin('/', (args) => {
    if (args.length === 0) throw new Error('/: 引数が必要です');
    if (args[0].type !== 'number') throw new Error(`/: 数値が期待されます`);
    if (args.length === 1) return makeNumber(1 / args[0].value);
    let result = args[0].value;
    for (let i = 1; i < args.length; i++) {
      const a = args[i];
      if (a.type !== 'number') throw new Error(`/: 数値が期待されます`);
      if (a.value === 0) throw new Error('ゼロ除算エラー');
      result /= a.value;
    }
    return makeNumber(result);
  });

  defBuiltin('MOD', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('mod: 数値が期待されます');
    return makeNumber(args[0].value % args[1].value);
  });

  defBuiltin('ABS', (args) => {
    if (args[0].type !== 'number') throw new Error('abs: 数値が期待されます');
    return makeNumber(Math.abs(args[0].value));
  });

  defBuiltin('MAX', (args) => {
    const nums = args.map(a => { if (a.type !== 'number') throw new Error('max: 数値が期待されます'); return a.value; });
    return makeNumber(Math.max(...nums));
  });

  defBuiltin('MIN', (args) => {
    const nums = args.map(a => { if (a.type !== 'number') throw new Error('min: 数値が期待されます'); return a.value; });
    return makeNumber(Math.min(...nums));
  });

  defBuiltin('FLOOR', (args) => {
    if (args[0].type !== 'number') throw new Error('floor: 数値が期待されます');
    return makeNumber(Math.floor(args[0].value));
  });

  defBuiltin('CEILING', (args) => {
    if (args[0].type !== 'number') throw new Error('ceiling: 数値が期待されます');
    return makeNumber(Math.ceil(args[0].value));
  });

  defBuiltin('ROUND', (args) => {
    if (args[0].type !== 'number') throw new Error('round: 数値が期待されます');
    return makeNumber(Math.round(args[0].value));
  });

  defBuiltin('SQRT', (args) => {
    if (args[0].type !== 'number') throw new Error('sqrt: 数値が期待されます');
    return makeNumber(Math.sqrt(args[0].value));
  });

  defBuiltin('EXPT', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('expt: 数値が期待されます');
    return makeNumber(Math.pow(args[0].value, args[1].value));
  });

  // Comparison
  defBuiltin('=', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('=: 数値が期待されます');
    return args[0].value === args[1].value ? T : NIL;
  });

  defBuiltin('/=', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('/=: 数値が期待されます');
    return args[0].value !== args[1].value ? T : NIL;
  });

  defBuiltin('<', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('<: 数値が期待されます');
    return args[0].value < args[1].value ? T : NIL;
  });

  defBuiltin('>', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('>: 数値が期待されます');
    return args[0].value > args[1].value ? T : NIL;
  });

  defBuiltin('<=', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('<=: 数値が期待されます');
    return args[0].value <= args[1].value ? T : NIL;
  });

  defBuiltin('>=', (args) => {
    if (args[0].type !== 'number' || args[1].type !== 'number') throw new Error('>=: 数値が期待されます');
    return args[0].value >= args[1].value ? T : NIL;
  });

  defBuiltin('ZEROP', (args) => {
    if (args[0].type !== 'number') throw new Error('zerop: 数値が期待されます');
    return args[0].value === 0 ? T : NIL;
  });

  defBuiltin('PLUSP', (args) => {
    if (args[0].type !== 'number') throw new Error('plusp: 数値が期待されます');
    return args[0].value > 0 ? T : NIL;
  });

  defBuiltin('MINUSP', (args) => {
    if (args[0].type !== 'number') throw new Error('minusp: 数値が期待されます');
    return args[0].value < 0 ? T : NIL;
  });

  defBuiltin('EVENP', (args) => {
    if (args[0].type !== 'number') throw new Error('evenp: 数値が期待されます');
    return args[0].value % 2 === 0 ? T : NIL;
  });

  defBuiltin('ODDP', (args) => {
    if (args[0].type !== 'number') throw new Error('oddp: 数値が期待されます');
    return args[0].value % 2 !== 0 ? T : NIL;
  });

  defBuiltin('1+', (args) => {
    if (args[0].type !== 'number') throw new Error('1+: 数値が期待されます');
    return makeNumber(args[0].value + 1);
  });

  defBuiltin('1-', (args) => {
    if (args[0].type !== 'number') throw new Error('1-: 数値が期待されます');
    return makeNumber(args[0].value - 1);
  });

  // Equality
  defBuiltin('EQ', (args) => isEqual(args[0], args[1]) ? T : NIL);
  defBuiltin('EQL', (args) => isEqual(args[0], args[1]) ? T : NIL);
  defBuiltin('EQUAL', (args) => isEqual(args[0], args[1]) ? T : NIL);

  // Type predicates
  defBuiltin('NUMBERP', (args) => args[0].type === 'number' ? T : NIL);
  defBuiltin('STRINGP', (args) => args[0].type === 'string' ? T : NIL);
  defBuiltin('SYMBOLP', (args) => args[0].type === 'symbol' ? T : NIL);
  defBuiltin('LISTP', (args) => (args[0].type === 'list' || args[0].type === 'nil') ? T : NIL);
  defBuiltin('CONSP', (args) => args[0].type === 'list' ? T : NIL);
  defBuiltin('ATOM', (args) => args[0].type !== 'list' ? T : NIL);
  defBuiltin('NULL', (args) => args[0].type === 'nil' ? T : NIL);
  defBuiltin('FUNCTIONP', (args) => (args[0].type === 'function' || args[0].type === 'lambda') ? T : NIL);

  // List operations
  defBuiltin('CAR', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('car: リストが期待されます');
    return args[0].elements[0] ?? NIL;
  });

  defBuiltin('CDR', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('cdr: リストが期待されます');
    const rest = args[0].elements.slice(1);
    return rest.length === 0 ? NIL : { type: 'list', elements: rest };
  });

  defBuiltin('FIRST', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('first: リストが期待されます');
    return args[0].elements[0] ?? NIL;
  });

  defBuiltin('REST', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('rest: リストが期待されます');
    const rest = args[0].elements.slice(1);
    return rest.length === 0 ? NIL : { type: 'list', elements: rest };
  });

  defBuiltin('SECOND', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('second: リストが期待されます');
    return args[0].elements[1] ?? NIL;
  });

  defBuiltin('THIRD', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('third: リストが期待されます');
    return args[0].elements[2] ?? NIL;
  });

  defBuiltin('NTH', (args) => {
    if (args[0].type !== 'number') throw new Error('nth: 数値が期待されます');
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('nth: リストが期待されます');
    return list.elements[args[0].value] ?? NIL;
  });

  defBuiltin('CONS', (args) => {
    const second = args[1];
    if (second.type === 'nil') {
      return { type: 'list', elements: [args[0]] };
    }
    if (second.type === 'list') {
      return { type: 'list', elements: [args[0], ...second.elements] };
    }
    // Dotted pair as list for simplicity
    return { type: 'list', elements: [args[0], second] };
  });

  defBuiltin('LIST', (args) => {
    if (args.length === 0) return NIL;
    return { type: 'list', elements: [...args] };
  });

  defBuiltin('APPEND', (args) => {
    const elements: LispValue[] = [];
    for (const arg of args) {
      if (arg.type === 'list') {
        elements.push(...arg.elements);
      } else if (arg.type !== 'nil') {
        elements.push(arg);
      }
    }
    return elements.length === 0 ? NIL : { type: 'list', elements };
  });

  defBuiltin('LENGTH', (args) => {
    if (args[0].type === 'nil') return makeNumber(0);
    if (args[0].type === 'list') return makeNumber(args[0].elements.length);
    if (args[0].type === 'string') return makeNumber(args[0].value.length);
    throw new Error('length: リストまたは文字列が期待されます');
  });

  defBuiltin('REVERSE', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('reverse: リストが期待されます');
    return { type: 'list', elements: [...args[0].elements].reverse() };
  });

  defBuiltin('LAST', (args) => {
    if (args[0].type === 'nil') return NIL;
    if (args[0].type !== 'list') throw new Error('last: リストが期待されます');
    const last = args[0].elements[args[0].elements.length - 1];
    return { type: 'list', elements: [last] };
  });

  defBuiltin('MEMBER', (args) => {
    const item = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('member: リストが期待されます');
    const idx = list.elements.findIndex(el => isEqual(el, item));
    if (idx === -1) return NIL;
    return { type: 'list', elements: list.elements.slice(idx) };
  });

  defBuiltin('REMOVE', (args) => {
    const item = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('remove: リストが期待されます');
    const filtered = list.elements.filter(el => !isEqual(el, item));
    return filtered.length === 0 ? NIL : { type: 'list', elements: filtered };
  });

  defBuiltin('ASSOC', (args) => {
    const key = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('assoc: リストが期待されます');
    for (const pair of list.elements) {
      if (pair.type === 'list' && pair.elements.length > 0 && isEqual(pair.elements[0], key)) {
        return pair;
      }
    }
    return NIL;
  });

  // Higher-order functions
  defBuiltin('MAPCAR', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('mapcar: リストが期待されます');
    const results = list.elements.map(el => applyFn(fn, [el], callEnv, output));
    return { type: 'list', elements: results };
  });

  defBuiltin('REMOVE-IF', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('remove-if: リストが期待されます');
    const filtered = list.elements.filter(el => !isTruthy(applyFn(fn, [el], callEnv, output)));
    return filtered.length === 0 ? NIL : { type: 'list', elements: filtered };
  });

  defBuiltin('REMOVE-IF-NOT', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('remove-if-not: リストが期待されます');
    const filtered = list.elements.filter(el => isTruthy(applyFn(fn, [el], callEnv, output)));
    return filtered.length === 0 ? NIL : { type: 'list', elements: filtered };
  });

  defBuiltin('REDUCE', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('reduce: リストが期待されます');
    if (list.elements.length === 0) return NIL;
    let acc = list.elements[0];
    for (let i = 1; i < list.elements.length; i++) {
      acc = applyFn(fn, [acc, list.elements[i]], callEnv, output);
    }
    return acc;
  });

  defBuiltin('SOME', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('some: リストが期待されます');
    for (const el of list.elements) {
      if (isTruthy(applyFn(fn, [el], callEnv, output))) return T;
    }
    return NIL;
  });

  defBuiltin('EVERY', (args, callEnv) => {
    const fn = args[0];
    const list = args[1];
    if (list.type === 'nil') return T;
    if (list.type !== 'list') throw new Error('every: リストが期待されます');
    for (const el of list.elements) {
      if (!isTruthy(applyFn(fn, [el], callEnv, output))) return NIL;
    }
    return T;
  });

  defBuiltin('SORT', (args, callEnv) => {
    const list = args[0];
    const fn = args[1];
    if (list.type === 'nil') return NIL;
    if (list.type !== 'list') throw new Error('sort: リストが期待されます');
    const sorted = [...list.elements].sort((a, b) => {
      return isTruthy(applyFn(fn, [a, b], callEnv, output)) ? -1 : 1;
    });
    return { type: 'list', elements: sorted };
  });

  // String operations
  defBuiltin('CONCATENATE', (args) => {
    if (args[0].type !== 'symbol' || args[0].name !== 'STRING') {
      throw new Error("concatenate: 最初の引数は 'string である必要があります");
    }
    const parts = args.slice(1).map(a => {
      if (a.type === 'string') return a.value;
      return printValue(a);
    });
    return makeString(parts.join(''));
  });

  defBuiltin('STRING-UPCASE', (args) => {
    if (args[0].type !== 'string') throw new Error('string-upcase: 文字列が期待されます');
    return makeString(args[0].value.toUpperCase());
  });

  defBuiltin('STRING-DOWNCASE', (args) => {
    if (args[0].type !== 'string') throw new Error('string-downcase: 文字列が期待されます');
    return makeString(args[0].value.toLowerCase());
  });

  defBuiltin('SUBSEQ', (args) => {
    if (args[0].type !== 'string') throw new Error('subseq: 文字列が期待されます');
    if (args[1].type !== 'number') throw new Error('subseq: 開始位置は数値である必要があります');
    const end = args[2]?.type === 'number' ? args[2].value : undefined;
    return makeString(args[0].value.substring(args[1].value, end));
  });

  defBuiltin('STRING=', (args) => {
    if (args[0].type !== 'string' || args[1].type !== 'string') throw new Error('string=: 文字列が期待されます');
    return args[0].value === args[1].value ? T : NIL;
  });

  defBuiltin('WRITE-TO-STRING', (args) => {
    return makeString(printValue(args[0]));
  });

  defBuiltin('PARSE-INTEGER', (args) => {
    if (args[0].type !== 'string') throw new Error('parse-integer: 文字列が期待されます');
    const n = parseInt(args[0].value, 10);
    if (isNaN(n)) throw new Error(`parse-integer: "${args[0].value}" は整数に変換できません`);
    return makeNumber(n);
  });

  // I/O
  defBuiltin('PRINT', (args) => {
    const val = args[0];
    output(printValue(val) + '\n');
    return val;
  });

  defBuiltin('PRINC', (args) => {
    const val = args[0];
    output(val.type === 'string' ? val.value : printValue(val));
    return val;
  });

  defBuiltin('TERPRI', () => {
    output('\n');
    return NIL;
  });

  defBuiltin('FORMAT', (args) => {
    const dest = args[0];
    if (args[1].type !== 'string') throw new Error('format: フォーマット文字列が期待されます');
    let fmt = args[1].value;
    let argIdx = 2;

    let result = '';
    let i = 0;
    while (i < fmt.length) {
      if (fmt[i] === '~' && i + 1 < fmt.length) {
        const directive = fmt[i + 1].toUpperCase();
        switch (directive) {
          case 'A': {
            const arg = args[argIdx];
            result += arg ? (arg.type === 'string' ? arg.value : printValue(arg)) : '';
            argIdx++;
          }
            break;
          case 'S':
            result += args[argIdx] ? printValue(args[argIdx]) : '';
            argIdx++;
            break;
          case 'D':
            result += args[argIdx] ? printValue(args[argIdx]) : '';
            argIdx++;
            break;
          case '%':
            result += '\n';
            break;
          case '~':
            result += '~';
            break;
          default:
            result += '~' + fmt[i + 1];
        }
        i += 2;
      } else {
        result += fmt[i];
        i++;
      }
    }

    if (isTruthy(dest)) {
      output(result);
      return NIL;
    }
    return makeString(result);
  });

  return env;
}

/**
 * Re-bind output-dependent built-in functions (PRINT, PRINC, TERPRI, FORMAT)
 * in an existing environment so they use a new output callback.
 * Used by REPL to redirect output per evaluation while keeping the same env.
 */
export function rebindOutputBuiltins(env: Environment, output: OutputFn): void {
  const set = (name: string, fn: (args: LispValue[], env: Environment) => LispValue) => {
    envSet(env, name, { type: 'function', name, fn });
  };

  set('PRINT', (args) => {
    const val = args[0];
    output(printValue(val) + '\n');
    return val;
  });

  set('PRINC', (args) => {
    const val = args[0];
    output(val.type === 'string' ? val.value : printValue(val));
    return val;
  });

  set('TERPRI', () => {
    output('\n');
    return NIL;
  });

  set('FORMAT', (args) => {
    const dest = args[0];
    if (args[1].type !== 'string') throw new Error('format: フォーマット文字列が期待されます');
    let fmt = args[1].value;
    let argIdx = 2;

    let result = '';
    let i = 0;
    while (i < fmt.length) {
      if (fmt[i] === '~' && i + 1 < fmt.length) {
        const directive = fmt[i + 1].toUpperCase();
        switch (directive) {
          case 'A': {
            const arg = args[argIdx];
            result += arg ? (arg.type === 'string' ? arg.value : printValue(arg)) : '';
            argIdx++;
          }
            break;
          case 'S':
            result += args[argIdx] ? printValue(args[argIdx]) : '';
            argIdx++;
            break;
          case 'D':
            result += args[argIdx] ? printValue(args[argIdx]) : '';
            argIdx++;
            break;
          case '%':
            result += '\n';
            break;
          case '~':
            result += '~';
            break;
          default:
            result += '~' + fmt[i + 1];
        }
        i += 2;
      } else {
        result += fmt[i];
        i++;
      }
    }

    if (isTruthy(dest)) {
      output(result);
      return NIL;
    }
    return makeString(result);
  });
}
