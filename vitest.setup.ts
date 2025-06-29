import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('*.module.css', () => ({
  default: {},
  root: 'root',
  active: 'active',
}));
