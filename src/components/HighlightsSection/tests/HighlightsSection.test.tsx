import { render, screen } from '@testing-library/react';

import { HighlightsSection } from '../HighlightsSection';

describe('HighlightsSection', () => {
  it('показывает плейсхолдер когда нет хайлайтов', () => {
    render(<HighlightsSection highlights={[]} />);
    expect(screen.getByText('Здесь появятся хайлайты')).toBeInTheDocument();
  });

  it('отображает хайлайты в сетке', () => {
    const highlights = [
      { title: 'Хайлайт 1', description: 'Описание 1' },
      { title: 'Хайлайт 2', description: 'Описание 2' },
    ];

    render(<HighlightsSection highlights={highlights} />);
    
    expect(screen.getByText('Хайлайт 1')).toBeInTheDocument();
    expect(screen.getByText('Описание 1')).toBeInTheDocument();
    expect(screen.getByText('Хайлайт 2')).toBeInTheDocument();
    expect(screen.getByText('Описание 2')).toBeInTheDocument();
  });
});