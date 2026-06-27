import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock server-only since vitest uses a jsdom environment for all tests
vi.mock('server-only', () => ({}));
