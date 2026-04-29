// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LispGuide } from '../LispGuide';

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/guide']}>
      <Routes>
        <Route path="/guide" element={<LispGuide />} />
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

  it('条件分岐セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('条件分岐')).toBeInTheDocument();
  });

  it('リスト操作セクションを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('リスト操作')).toBeInTheDocument();
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
});
