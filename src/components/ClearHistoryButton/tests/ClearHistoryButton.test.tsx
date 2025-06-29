import { ClearHistoryButton } from '@components/ClearHistoryButton';
import { vi } from 'vitest';

import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';

const mockUseHistoryStore = vi.fn()
const mockClearHistoryStorage = vi.fn()

describe('ClearHistoryButton', () => {
  const mockClearHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не отображается когда история пуста', async () => {
    mockUseHistoryStore.mockReturnValue({
      clearHistory: mockClearHistory,
      history: [],
    });

    await render(<ClearHistoryButton />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('отображается когда есть элементы в истории', () => {
    mockUseHistoryStore.mockReturnValue({
      clearHistory: mockClearHistory,
      history: [{ id: '1', fileName: 'test.csv', timestamp: Date.now() }],
    });

    render(<ClearHistoryButton />);
    waitFor(() => {
      expect(screen.getByText(/Очистить всё/i)).toBeInTheDocument();
    });
  });

  it('вызывает clearHistory и clearHistoryStorage при клике', () => {
    mockUseHistoryStore.mockReturnValue({
      clearHistory: mockClearHistory,
      history: [{ id: '1', fileName: 'test.csv', timestamp: Date.now() }],
    });

    render(<ClearHistoryButton />);
    waitFor(() => {
          
    const button = screen.getByText('Очистить всё');
    fireEvent.click(button);

    expect(mockClearHistory).toHaveBeenCalledTimes(1);
    expect(mockClearHistoryStorage).toHaveBeenCalledTimes(1);
});
  });
});