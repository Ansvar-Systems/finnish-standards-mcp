// __tests__/unit/search-by-sector.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchBySector } from '../../src/tools/search-by-sector.js';

describe('handleSearchBySector', () => {
  it('healthcare sector returns kanta-tietoturva but not julkri', () => {
    const result = handleSearchBySector({ sector: 'healthcare' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    expect(text).toContain('kanta-tietoturva');
    expect(text).not.toContain('julkri');
    expect(text).not.toContain('katakri');
  });

  it('government sector returns julkri and katakri', () => {
    const result = handleSearchBySector({ sector: 'government' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('julkri');
    expect(text).toContain('katakri');
    expect(text).not.toContain('kanta-tietoturva');
  });

  it('with query param returns matching controls within sector frameworks', () => {
    // julkri and katakri are government sector; "tietoturva" matches their controls
    const result = handleSearchBySector({ sector: 'government', query: 'tietoturva' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Framework section must be present
    expect(text).toContain('julkri');

    // Controls section must be present with a match
    expect(text).toContain('julkri:');

    // Must not leak controls from other sectors
    expect(text).not.toContain('kanta-tietoturva:');
  });

  it('unknown sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: 'unknown-sector-xyz' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('missing/empty sector returns INVALID_INPUT', () => {
    // @ts-expect-error — intentional missing arg for test
    const result = handleSearchBySector({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('empty string sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('energy sector returns ncsc-fi-ohjeet frameworks', () => {
    // NCSC-FI guidelines cover energy among other critical infrastructure sectors
    const result = handleSearchBySector({ sector: 'energy' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('ncsc-fi-ohjeet');
    // Government-only frameworks should not appear
    expect(text).not.toContain('| julkri |');
    expect(text).not.toContain('| katakri |');
    expect(text).not.toContain('| vahti |');
  });
});
