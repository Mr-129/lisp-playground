import { describe, it, expect } from 'vitest';
import { createEnv, envGet, envSet, envUpdate } from '../environment';
import { makeNumber, makeString, NIL } from '../types';

describe('environment', () => {
  describe('envSet / envGet', () => {
    it('値をセット・取得できる', () => {
      const env = createEnv();
      envSet(env, 'x', makeNumber(10));
      expect(envGet(env, 'x')).toEqual(makeNumber(10));
    });

    it('大文字小文字を区別しない', () => {
      const env = createEnv();
      envSet(env, 'foo', makeString('bar'));
      expect(envGet(env, 'FOO')).toEqual(makeString('bar'));
      expect(envGet(env, 'Foo')).toEqual(makeString('bar'));
    });

    it('未定義の変数は undefined を返す', () => {
      const env = createEnv();
      expect(envGet(env, 'nonexistent')).toBeUndefined();
    });
  });

  describe('親環境の参照', () => {
    it('親の変数を参照できる', () => {
      const parent = createEnv();
      envSet(parent, 'a', makeNumber(1));
      const child = createEnv(parent);
      expect(envGet(child, 'a')).toEqual(makeNumber(1));
    });

    it('子の変数は親から見えない', () => {
      const parent = createEnv();
      const child = createEnv(parent);
      envSet(child, 'b', makeNumber(2));
      expect(envGet(parent, 'b')).toBeUndefined();
    });

    it('子が親の変数をシャドウする', () => {
      const parent = createEnv();
      envSet(parent, 'x', makeNumber(1));
      const child = createEnv(parent);
      envSet(child, 'x', makeNumber(99));
      expect(envGet(child, 'x')).toEqual(makeNumber(99));
      expect(envGet(parent, 'x')).toEqual(makeNumber(1));
    });
  });

  describe('envUpdate', () => {
    it('既存の変数を更新する', () => {
      const env = createEnv();
      envSet(env, 'x', makeNumber(1));
      const updated = envUpdate(env, 'x', makeNumber(2));
      expect(updated).toBe(true);
      expect(envGet(env, 'x')).toEqual(makeNumber(2));
    });

    it('存在しない変数は更新できない', () => {
      const env = createEnv();
      expect(envUpdate(env, 'z', NIL)).toBe(false);
    });

    it('親環境の変数を更新できる', () => {
      const parent = createEnv();
      envSet(parent, 'y', makeNumber(10));
      const child = createEnv(parent);
      const updated = envUpdate(child, 'y', makeNumber(20));
      expect(updated).toBe(true);
      expect(envGet(parent, 'y')).toEqual(makeNumber(20));
    });
  });
});
