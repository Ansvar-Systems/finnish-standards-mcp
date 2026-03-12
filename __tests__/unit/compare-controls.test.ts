// __tests__/unit/compare-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleCompareControls } from '../../src/tools/compare-controls.js';

describe('handleCompareControls', () => {
  it('compares controls across julkri and katakri for "tietoturva"', () => {
    const result = handleCompareControls({
      query: 'tietoturva',
      framework_ids: ['julkri', 'katakri'],
    });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Should have a section for each framework
    expect(text).toContain('julkri');
    expect(text).toContain('katakri');
  });

  it('returns INVALID_INPUT for fewer than 2 frameworks', () => {
    const result = handleCompareControls({
      query: 'tietoturva',
      framework_ids: ['julkri'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty framework_ids array', () => {
    const result = handleCompareControls({
      query: 'tietoturva',
      framework_ids: [],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT for more than 4 frameworks', () => {
    const result = handleCompareControls({
      query: 'tietoturva',
      framework_ids: ['julkri', 'katakri', 'vahti', 'ncsc-fi-ohjeet', 'kanta-tietoturva'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT when framework_ids is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ query: 'tietoturva' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT when query is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ framework_ids: ['julkri', 'katakri'] });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('renders one markdown section per framework', () => {
    const result = handleCompareControls({
      query: 'salaus',
      framework_ids: ['julkri', 'katakri'],
    });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toMatch(/##\s+julkri/);
    expect(text).toMatch(/##\s+katakri/);
  });
});
