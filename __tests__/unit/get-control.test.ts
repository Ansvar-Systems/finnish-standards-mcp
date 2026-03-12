// __tests__/unit/get-control.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetControl } from '../../src/tools/get-control.js';

describe('handleGetControl', () => {
  it('returns full control detail for julkri:HAL-01', () => {
    const result = handleGetControl({ control_id: 'julkri:HAL-01' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Control number
    expect(text).toContain('HAL-01');

    // Finnish title
    expect(text).toContain('Tietoturvapolitiikka');

    // English title
    expect(text).toContain('Information security policy');

    // Framework name
    expect(text).toContain('Julkri');

    // Category
    expect(text).toContain('Hallinnollinen tietoturva');

    // Level
    expect(text).toContain('P');

    // ISO mapping
    expect(text).toContain('5.1');
  });

  it('returns NO_MATCH for julkri:ZZZ-999', () => {
    const result = handleGetControl({ control_id: 'julkri:ZZZ-999' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing control_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetControl({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
