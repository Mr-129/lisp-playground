# Lisp Playground — 採点モデル設計

**作成日**: 2026年5月8日  
**位置づけ**: 問題拡張前に採点基盤を固めるための設計メモ  
**関連文書**: [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md), [REVIEW.md](./REVIEW.md)

---

## 1. 背景

現行の採点は、[src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx) で `expectedOutput` と `expectedReturnValue` の完全一致を直接比較する方式である。

現状の方式は、小さな練習問題には十分機能している。一方で、今後の問題拡張を考えると次の制約がある。

- 問題データが `expectedOutput` / `expectedReturnValue` に強く依存している
- 判定ロジックが UI コンポーネントに埋め込まれている
- 複数テストケースを持つ問題を表現しにくい
- 関数定義型の問題や hidden test を扱えない
- 出力末尾の改行や空白差分で不必要に不正解になりやすい

今後、問題数を増やし、学習サイトとしての完成度を上げるには、まず採点方式を拡張可能な構造へ切り出す必要がある。

---

## 2. 設計目標

この設計の目標は次の 5 つである。

1. 既存 51 問を壊さずに移行できること
2. 将来の問題文拡張に耐えられること
3. 現行のブラウザ内インタプリタ構成を大きく崩さないこと
4. 学習者にとって結果が分かりやすいこと
5. 問題データ、採点ロジック、UI 表示の責務を分離すること

---

## 3. 非目標

初期段階では次は扱わない。

- 不正対策を前提にした厳密な採点
- サーバー側採点
- 高度な AST 比較
- 部分点やランキングなど競技プログラミング寄りの採点

Lisp Playground は学習サイトであり、初期段階では「学びやすく、拡張しやすい」ことを優先する。

---

## 4. 基本方針

### 4.1 採点ロジックを UI から分離する

採点は `EditorPage.tsx` の if 文ではなく、専用の judge レイヤーに集約する。

想定構成:

- `src/judge/types.ts` — 採点用型定義
- `src/judge/runJudge.ts` — 採点実行
- `src/judge/compare.ts` — 比較ロジック
- `src/judge/legacy.ts` — 既存問題との互換レイヤー

### 4.2 問題データに judge 設定を持たせる

将来の拡張は UI 側ではなく、問題データ側で表現できるようにする。

### 4.3 1 ケースごとに独立実行する

関数定義型の問題でも、各ケースで `ユーザーコード + ケース実行コード` を独立に流す方式にする。

これにより次の利点がある。

- 既存の `executeLispAsync` をそのまま再利用できる
- ケース間の副作用が混ざらない
- hidden test の実装がしやすい
- インタプリタ内部へ大きな変更を入れなくてよい

### 4.4 visible test と hidden test を分ける

学習用なので、全部 hidden にするのではなく、最低 1 件は visible case を持てるようにする。

- visible case: 学習者に表示する
- hidden case: 最終合否に使うが詳細は出しすぎない

---

## 5. 提案する採点モデル

### 5.1 Problem 型の拡張方針

現行の `Problem` に将来的に次を追加する。

```ts
export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  hint?: string;
  initialCode: string;
  solution: string;
  order: number;
  estimatedMinutes: number;
  learningGoals: string[];
  judge?: JudgeSpec;

  // 移行期間のみ残す legacy fields
  expectedOutput?: string;
  expectedReturnValue?: string;
}

export type JudgeSpec = ProgramJudgeSpec | FunctionJudgeSpec;

interface BaseJudgeSpec {
  kind: 'program' | 'function';
  passRule?: 'all';
  timeoutMs?: number;
}

interface ProgramJudgeSpec extends BaseJudgeSpec {
  kind: 'program';
  cases: JudgeCase[];
}

interface FunctionJudgeSpec extends BaseJudgeSpec {
  kind: 'function';
  functionName: string;
  cases: JudgeCase[];
}

interface JudgeCase {
  id: string;
  label: string;
  visibility: 'visible' | 'hidden';
  run: {
    code: string;
  };
  expect: {
    output?: StringExpectation;
    returnValue?: StringExpectation;
    error?: StringExpectation;
  };
}

interface StringExpectation {
  value: string;
  comparison?: 'exact' | 'trimmed' | 'normalized-lines';
}
```

### 5.2 初期フェーズで採用する judge 種別

初期フェーズでは 2 種類だけに絞る。

#### A. `program`

今の問題と最も近い。コード全体を 1 回実行し、出力と戻り値を比較する。

用途:

- 初学者向けの print 問題
- 小さなスクリプト問題
- 現行 51 問の大半

#### B. `function`

ユーザーに関数定義を書いてもらい、複数ケースを順番に採点する。

用途:

- `sum-list` のような関数問題
- hidden test を持たせたい問題
- 問題文を本格化したい中級以降の問題

---

## 6. ケース実行方式

### 6.1 `program` の実行

`program` はそのままユーザーコードを実行する。

```ts
const result = await executeLispAsync(userCode, timeoutMs);
```

その結果を `JudgeCase.expect` と比較する。

### 6.2 `function` の実行

`function` は各ケースごとに次の形で実行する。

```lisp
; user submission
(defun sum-list (lst)
  ...)

; test harness for one case
(sum-list '(1 2 3 4))
```

TypeScript 側では次のように組み立てる。

```ts
const source = `${userCode}\n${judgeCase.run.code}`;
const result = await executeLispAsync(source, timeoutMs);
```

この方式なら、現在の worker と interpreter の構造をそのまま使える。

---

## 7. 比較ルール

完全一致だけにすると学習者体験が硬くなるため、比較ルールを選べるようにする。

### 7.1 `exact`

文字列をそのまま比較する。

用途:

- 厳密に同じ出力が必要な問題
- 既存問題との互換維持

### 7.2 `trimmed`

先頭末尾の空白と末尾改行差分を無視する。

用途:

- 戻り値比較
- 文字列末尾差分で無駄に落としたくない問題

### 7.3 `normalized-lines`

行ごとに trim し、改行コード差分を吸収する。

用途:

- print ベースの問題
- Windows / Linux 改行差を避けたいとき

初期推奨値:

- `returnValue` は `trimmed`
- `output` は `exact` か `normalized-lines`

---

## 8. UI 表示方針

現行の `OutputPanel` は単一の「正解 / 不正解」しか持っていない。拡張後は次を出せるようにする。

### 8.1 初期表示

- 実行結果の出力
- 戻り値
- 採点バッジ

### 8.2 問題採点時

- visible case の pass / fail 一覧
- hidden case は件数のみ表示
- 最初の失敗ケースだけ詳細メッセージを表示

例:

- `✓ visible 2/2 passed`
- `✓ hidden 3/3 passed`
- `✗ case visible-2: 戻り値が期待値と一致しません`

### 8.3 学習者向けメッセージ

function 型では undefined function エラーをそのまま出すのではなく、
`sum-list が定義されていない可能性があります` のように補足を付ける。

---

## 9. 既存 51 問との互換方針

いきなり全問題を `judge` へ移行しない。

### 9.1 移行ステップ

1. `judge` があれば新方式を使う
2. `judge` がなければ `expectedOutput` / `expectedReturnValue` から互換 judge を生成する
3. 既存 51 問は動作を変えずに維持する
4. 新しい問題から `judge` フィールドを採用する
5. 全問題の移行後に legacy fields を削除する

### 9.2 互換レイヤーの例

```ts
function getJudgeSpec(problem: Problem): JudgeSpec | null {
  if (problem.judge) return problem.judge;

  if (problem.expectedOutput !== undefined || problem.expectedReturnValue !== undefined) {
    return {
      kind: 'program',
      cases: [
        {
          id: 'legacy-main',
          label: 'main',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: problem.expectedOutput
              ? { value: problem.expectedOutput, comparison: 'exact' }
              : undefined,
            returnValue: problem.expectedReturnValue
              ? { value: problem.expectedReturnValue, comparison: 'exact' }
              : undefined,
          },
        },
      ],
    };
  }

  return null;
}
```

この互換レイヤーがある限り、既存問題を一気に書き換える必要はない。

---

## 10. 推奨する実装順

### Phase A: 基盤化

1. `src/judge/` を追加する
2. `JudgeSpec` 型を導入する
3. 互換レイヤーを追加する
4. `EditorPage` の直接比較ロジックを judge レイヤー呼び出しへ置き換える

### Phase B: UI 拡張

1. `OutputPanel` にケース別結果表示を追加する
2. visible / hidden の表示ルールを入れる
3. 不正解時のメッセージを改善する

### Phase C: データ移行

1. 既存 51 問はそのまま動かす
2. 新規の 3 問だけ `judge` 形式で試験導入する
3. 問題追加のタイミングで順次移行する

---

## 11. この方式を採る理由

この案が現状に最も合う理由は次の通り。

1. **今のコードベースに近い**
   - `executeLispAsync` と worker をそのまま活用できる

2. **将来の問題拡張に耐える**
   - function 問題、visible test、hidden test を段階的に増やせる

3. **既存問題を壊しにくい**
   - 互換レイヤーで 51 問を維持したまま移行できる

4. **UI と採点の責務が分かれる**
   - 今後 OutputPanel や問題データを拡張しても影響範囲が読みやすい

5. **教科書や本格問題の導入前に土台を固められる**
   - コンテンツを増やしてから採点方式を作り直すより安全

---

## 12. 結論

Lisp Playground の次の採点モデルは、**単一の expectedOutput 比較から、judge 設定ベースのケース実行方式へ移行する**のがよい。

初期実装では次だけに絞る。

- `program` judge
- `function` judge
- visible / hidden case
- 互換レイヤーによる段階移行

この方針なら、今の学習サイトを壊さずに、将来の問題文拡張と教科書導入へ進める。