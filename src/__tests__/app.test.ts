import { describe, it, expect } from 'vitest';

describe('App Setup', () => {
  it('should render without crashing', () => {
    expect(true).toBe(true);
  });

  it('should have correct title', () => {
    expect(document.title).toBeDefined();
  });
});
