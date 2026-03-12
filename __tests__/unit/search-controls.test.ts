// __tests__/unit/search-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchControls } from '../../src/tools/search-controls.js';

describe('handleSearchControls', () => {
  it('finds controls by Finnish term "tietoturva"', () => {
    const result = handleSearchControls({ query: 'tietoturva' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;
    expect(text).toContain('julkri:');
    expect(text).toContain('total_results');
    expect(text).toContain('| ID |');
  });

  it('finds controls by English term "security"', () => {
    const result = handleSearchControls({ query: 'security' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('total_results');
    const totalMatch = text.match(/total_results:\s*(\d+)/);
    expect(totalMatch).not.toBeNull();
    const total = parseInt(totalMatch![1], 10);
    expect(total).toBeGreaterThan(0);
  });

  it('filters by framework_id', () => {
    const result = handleSearchControls({ query: 'tietoturva', framework_id: 'julkri' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('julkri:');
    expect(text).not.toContain('katakri:');
  });

  it('returns NO_MATCH for gibberish', () => {
    const result = handleSearchControls({ query: 'xyzzyqqqfoobarblarg' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty query', () => {
    const result = handleSearchControls({ query: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing query', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('supports pagination with offset', () => {
    const page1 = handleSearchControls({ query: 'tietoturva', limit: 1, offset: 0 });
    const page2 = handleSearchControls({ query: 'tietoturva', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    expect(text1).toContain('total_results');

    const totalMatch = text1.match(/total_results:\s*(\d+)/);
    if (totalMatch && parseInt(totalMatch[1], 10) > 1) {
      expect(page2.isError).toBeFalsy();
      const text2 = page2.content[0].text;
      expect(text1).not.toBe(text2);
    }
  });
});
