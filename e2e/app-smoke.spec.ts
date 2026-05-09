import { expect, test } from '@playwright/test';

test.describe('Lisp Playground smoke flows', () => {
  test('home から主要ページへ遷移できる', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 2, name: /Lisp Playground へようこそ/ })
    ).toBeVisible();

    await page.getByRole('button', { name: /構文ガイド/ }).first().click();
    await expect(page).toHaveURL(/#\/guide$/);
    await expect(
      page.getByRole('heading', { level: 2, name: /Common Lisp 基本構文ガイド/ })
    ).toBeVisible();

    await page.getByRole('button', { name: /学習$/ }).click();
    await expect(page).toHaveURL(/#\/problems$/);
    await expect(
      page.getByRole('heading', { level: 2, name: /問題一覧ページ/ })
    ).toBeVisible();

    await page.getByRole('button', { name: /REPL$/ }).click();
    await expect(page).toHaveURL(/#\/repl$/);
    await expect(page.getByRole('heading', { level: 2, name: /REPL/ })).toBeVisible();

    await page.getByRole('button', { name: /エディタ$/ }).click();
    await expect(page).toHaveURL(/#\/editor$/);
    await expect(page.locator('.current-problem-label')).toContainText('フリーモード');

    await page.getByRole('button', { name: 'ホームへ戻る' }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(
      page.getByRole('heading', { level: 2, name: /Lisp Playground へようこそ/ })
    ).toBeVisible();
  });

  test('おすすめ問題から学習ページとエディタへ進める', async ({ page }) => {
    await page.goto('/#/problems');

    const recommendedHeading = page.locator('.practice-recommendation h3');
    const recommendedTitle = (await recommendedHeading.textContent())?.trim();

    expect(recommendedTitle).toBeTruthy();

    const normalizedTitle = recommendedTitle!.replace(/^\d+\.\s*/, '');

    await page.getByRole('button', { name: 'この問題から始める' }).click();
    await expect(page).toHaveURL(/#\/learn$/);
    await expect(page.getByRole('heading', { level: 2, name: normalizedTitle })).toBeVisible();

    await page.getByRole('button', { name: /エディタで解く/ }).click();
    await expect(page).toHaveURL(/#\/editor$/);
    await expect(page.locator('.current-problem-label')).toContainText(normalizedTitle);
    await expect(page.getByRole('button', { name: 'コードを実行' })).toBeVisible();
  });

  test('REPL で式を評価して履歴をクリアできる', async ({ page }) => {
    await page.goto('/#/repl');

    const input = page.getByRole('textbox', { name: 'REPL 入力' });
    await input.fill('(+ 1 2 3)');
    await page.getByRole('button', { name: '式を評価' }).click();

    await expect(page.locator('.repl-return').last()).toContainText('6');
    await expect(page.locator('.repl-entry')).toHaveCount(1);

    await page.getByRole('button', { name: /クリア/ }).click();
    await expect(page.locator('.repl-entry')).toHaveCount(0);
    await expect(page.getByText('Common Lisp REPL へようこそ！')).toBeVisible();
  });
});