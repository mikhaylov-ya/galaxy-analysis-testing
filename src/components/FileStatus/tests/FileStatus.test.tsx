import { FileStatus } from '../FileStatus';
import styles from '../FileStatus.module.css';

import { render, screen } from '@/tests/test-utils';

describe('FileStatus Component', () => {
    it('renders success message when type is "success"', () => {
        render(<FileStatus type="success" isActive={true} />);
        expect(screen.getByText(/Обработан успешно/i)).toBeInTheDocument();
    });

    it('renders error message when type is "error"', () => {
        render(<FileStatus type="error" isActive={true} />);
        expect(screen.getByText(/Не удалось обработать/i)).toBeInTheDocument();
    });

    it('applies active class when isActive is true', () => {
        render(<FileStatus type="success" isActive={true} />);
        expect(screen.getByTestId('file-status')).toHaveClass(styles.active);
    });

    it('does not apply active class when isActive is false', () => {
        render(<FileStatus type="success" isActive={false} />);
        expect(screen.getByTestId('file-status')).not.toHaveClass(styles.active);
    });
});
