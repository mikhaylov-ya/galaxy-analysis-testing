import { Header } from '../Header';

import { render, screen, waitFor } from '@/tests/test-utils';

describe('Header', () => {
  it('отображает компоненты Title и Navigation', () => {
    render(<Header />);
    waitFor(() => {
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    })
  });
});