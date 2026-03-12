// __tests__/unit/get-iso-mapping.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetIsoMapping } from '../../src/tools/get-iso-mapping.js';

describe('handleGetIsoMapping', () => {
  it('finds Finnish controls mapped to ISO 5.1', () => {
    const result = handleGetIsoMapping({ iso_control: '5.1' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // julkri controls with iso_mapping="5.1" must appear
    expect(text).toContain('julkri:HAL-01');

    // Should show the ISO control in the heading
    expect(text).toContain('5.1');

    // Markdown table structure
    expect(text).toContain('| ID |');
  });

  it('finds controls mapped to ISO 8.15', () => {
    const result = handleGetIsoMapping({ iso_control: '8.15' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // julkri controls with iso_mapping="8.15" must appear
    expect(text).toContain('julkri:TJA-03');
    expect(text).toContain('8.15');
  });

  it('returns NO_MATCH for unmapped ISO control', () => {
    const result = handleGetIsoMapping({ iso_control: '99.99' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing iso_control param', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetIsoMapping({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
