// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './app';

vi.mock('./components/scrollbar/custom-scrollbar', () => ({ default: () => null }));

const navigate = (hash: string) =>
  act(() => {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, '', '#/diaries');
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('blank document pages', () => {
  it('shows only diaries and orders and redirects old page hashes to diaries', () => {
    window.history.replaceState(null, '', '#/protocol');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Дневник истории болезни' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Разделы сайта' }).textContent).toBe(
      'ДневникиНазначения',
    );
  });

  it('switches to orders and cancels a pending transition back to diaries', () => {
    render(<App />);
    navigate('#/orders');
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getAllByRole('heading', { name: 'Лист назначений' })).toHaveLength(2);
    navigate('#/diaries');
    navigate('#/orders');
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getAllByRole('heading', { name: 'Лист назначений' })).toHaveLength(2);
    expect(screen.queryByRole('heading', { name: 'Дневник истории болезни' })).toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(
      screen.getAllByRole('article').map((article) => article.getAttribute('aria-label')),
    ).toEqual(['Лист назначений, страница 1', 'Лист назначений, страница 2']);
  });
});
