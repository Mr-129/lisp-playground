// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LispGuide } from '../LispGuide';

function renderWithRouter(props: Partial<Parameters<typeof LispGuide>[0]> = {}) {
  return render(
    <MemoryRouter initialEntries={['/guide']}>
      <Routes>
        <Route path="/guide" element={<LispGuide {...props} />} />
        <Route path="/problems" element={<div>problems-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LispGuide', () => {
  it('メインタイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText(/Common Lisp 基本構文ガイド/)).toBeInTheDocument();
  });

  it('「Lispとは」セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Lispとは')).toBeInTheDocument();
  });

  it('S式セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('S式（S-expression）')).toBeInTheDocument();
  });

  it('基本データ型セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('基本データ型')).toBeInTheDocument();
  });

  it('変数セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('変数の定義と束縛')).toBeInTheDocument();
  });

  it('関数定義セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('関数の定義（defun）')).toBeInTheDocument();
  });

  it('lambda セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('無名関数（lambda）')).toBeInTheDocument();
  });

  it('評価セクションにコードとデータの補足を表示する', () => {
    renderWithRouter();
    expect(screen.getByText('シンボルは通常は変数として評価される')).toBeInTheDocument();
    expect(screen.getByText('コードとデータは同じ形で書ける')).toBeInTheDocument();
  });

  it('lambda セクションに function object の補足を表示する', () => {
    renderWithRouter();
    expect(screen.getByText("function と #'")).toBeInTheDocument();
    expect(screen.getByText('関数オブジェクトを変数に入れる')).toBeInTheDocument();
  });

  it('条件分岐セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('条件分岐')).toBeInTheDocument();
  });

  it('リスト操作セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('リスト操作')).toBeInTheDocument();
  });

  it('木構造と連想データのセクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('木構造・assoc・property list')).toBeInTheDocument();
    expect(screen.getByText('association list と assoc')).toBeInTheDocument();
  });

  it('高階関数セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByRole('heading', { name: '高階関数' })).toBeInTheDocument();
  });

  it('クロージャセクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('クロージャ')).toBeInTheDocument();
  });

  it('参考セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText(/参考/)).toBeInTheDocument();
  });

  it('HyperSpec リンクを含む', () => {
    renderWithRouter();
    const link = screen.getByText('Common Lisp HyperSpec');
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.lispworks.com/documentation/HyperSpec/Front/');
  });

  it('Practical Common Lisp リンクを含む', () => {
    renderWithRouter();
    const link = screen.getByText('Practical Common Lisp');
    expect(link.closest('a')).toHaveAttribute('href', 'https://gigamonkeys.com/book/');
  });

  it('フッターに「問題一覧に戻る」ボタンがある', () => {
    renderWithRouter();
    expect(screen.getByText('← 問題一覧に戻る')).toBeInTheDocument();
  });

  it('「問題一覧に戻る」ボタンで問題一覧ページへ戻れる', () => {
    renderWithRouter();
    fireEvent.click(screen.getByText('← 問題一覧に戻る'));
    expect(screen.getByText('problems-page')).toBeInTheDocument();
  });

  it('searchQuery で一致するガイドセクションだけ表示する', () => {
    renderWithRouter({ searchQuery: 'mapcar' });

    expect(screen.getByRole('heading', { name: '高階関数' })).toBeInTheDocument();
    expect(screen.queryByText('Lispとは')).not.toBeInTheDocument();
  });

  it('新しい検索語で評価セクションを絞り込める', () => {
    renderWithRouter({ searchQuery: 'code as data' });

    expect(screen.getByRole('heading', { name: '評価（Evaluation）とクォート' })).toBeInTheDocument();
    expect(screen.queryByText('Lispとは')).not.toBeInTheDocument();
  });

  it('新しい検索語で lambda セクションを絞り込める', () => {
    renderWithRouter({ searchQuery: 'function object' });

    expect(screen.getByRole('heading', { name: '無名関数（lambda）' })).toBeInTheDocument();
    expect(screen.queryByText('条件分岐')).not.toBeInTheDocument();
  });

  it('assoc 検索で tree / association list セクションを絞り込める', () => {
    renderWithRouter({ searchQuery: 'assoc' });

    expect(screen.getByRole('heading', { name: '木構造・assoc・property list' })).toBeInTheDocument();
    expect(screen.queryByText('Lispとは')).not.toBeInTheDocument();
  });

  it('一致しない検索語では空メッセージを表示する', () => {
    renderWithRouter({ searchQuery: 'not-found-keyword' });

    expect(screen.getByText(/一致するガイド項目はありません。/)).toBeInTheDocument();
  });
});
