// __tests__/unit/get-framework.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetFramework } from '../../src/tools/get-framework.js';

describe('handleGetFramework', () => {
  it('returns framework details for julkri including control count and categories', () => {
    const result = handleGetFramework({ framework_id: 'julkri' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Framework name (Finnish)
    expect(text).toContain('Julkri');

    // Issuing body
    expect(text).toContain('DVV');

    // Sectors
    expect(text).toContain('government');

    // Control count
    expect(text).toContain('79');

    // Categories
    expect(text).toContain('Hallinnollinen tietoturva');
    expect(text).toContain('Kayttoturvallisuus');
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleGetFramework({ framework_id: 'nonexistent-fw' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetFramework({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
