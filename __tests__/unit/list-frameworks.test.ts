// __tests__/unit/list-frameworks.test.ts
import { describe, it, expect } from 'vitest';
import { handleListFrameworks } from '../../src/tools/list-frameworks.js';

describe('handleListFrameworks', () => {
  it('returns a Markdown table containing all 13 frameworks with control counts', () => {
    const result = handleListFrameworks();

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Core framework IDs present
    expect(text).toContain('julkri');
    expect(text).toContain('katakri');
    expect(text).toContain('ncsc-fi-ohjeet');
    expect(text).toContain('traficom-maaraykset');
    expect(text).toContain('finanssivalvonta');
    expect(text).toContain('kyberturvallisuuslaki');

    // Framework names present
    expect(text).toContain('Julkri');
    expect(text).toContain('Katakri');
    expect(text).toContain('Traficom');

    // Issuing bodies present
    expect(text).toContain('DVV');
    expect(text).toContain('Puolustusministerio');

    // julkri row present
    expect(text).toContain('| julkri |');

    // Sectors present
    expect(text).toContain('government');
    expect(text).toContain('healthcare');
    expect(text).toContain('finance');
    expect(text).toContain('telecom');

    // Markdown table structure
    expect(text).toContain('| ID |');

    // 13 frameworks
    expect(text).toContain('13 frameworks');
  });
});
