// __tests__/unit/list-frameworks.test.ts
import { describe, it, expect } from 'vitest';
import { handleListFrameworks } from '../../src/tools/list-frameworks.js';

describe('handleListFrameworks', () => {
  it('returns a Markdown table containing all 6 frameworks with control counts', () => {
    const result = handleListFrameworks();

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Core framework IDs present
    expect(text).toContain('julkri');
    expect(text).toContain('katakri');
    expect(text).toContain('ncsc-fi-ohjeet');

    // Framework names present
    expect(text).toContain('Julkri');
    expect(text).toContain('Katakri');

    // Issuing bodies present
    expect(text).toContain('DVV');
    expect(text).toContain('Puolustusministerio');

    // julkri row present
    expect(text).toContain('| julkri |');

    // Sectors present
    expect(text).toContain('government');
    expect(text).toContain('healthcare');

    // Markdown table structure
    expect(text).toContain('| ID |');

    // 6 frameworks
    expect(text).toContain('6 frameworks');
  });
});
