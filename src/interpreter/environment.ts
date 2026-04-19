import { Environment, LispValue } from './types';

export function createEnv(parent: Environment | null = null): Environment {
  return { vars: new Map(), parent };
}

export function envGet(env: Environment, name: string): LispValue | undefined {
  const key = name.toUpperCase();
  const val = env.vars.get(key);
  if (val !== undefined) return val;
  if (env.parent) return envGet(env.parent, key);
  return undefined;
}

export function envSet(env: Environment, name: string, value: LispValue): void {
  env.vars.set(name.toUpperCase(), value);
}

export function envUpdate(env: Environment, name: string, value: LispValue): boolean {
  const key = name.toUpperCase();
  if (env.vars.has(key)) {
    env.vars.set(key, value);
    return true;
  }
  if (env.parent) return envUpdate(env.parent, key, value);
  return false;
}
