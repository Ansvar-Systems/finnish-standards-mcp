// __tests__/unit/list-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleListControls } from '../../src/tools/list-controls.js';

describe('handleListControls', () => {
  it('lists all controls for julkri with total_results count', () => {
    const result = handleListControls({ framework_id: 'julkri' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Header with total count (79 controls)
    expect(text).toContain('total_results: 79');

    // First julkri control present
    expect(text).toContain('julkri:HAL-01');

    // Markdown table structure
    expect(text).toContain('| ID |');
  });

  it('filters controls by category', () => {
    const result = handleListControls({ framework_id: 'julkri', category: 'Hallinnollinen tietoturva' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('julkri:HAL-01');
    // Should not contain controls from other categories
    expect(text).not.toContain('julkri:FYY-01');
  });

  it('filters controls by level', () => {
    const result = handleListControls({ framework_id: 'julkri', level: 'P' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('julkri:HAL-01');
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleListControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleListControls({ framework_id: 'nonexistent-framework' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('paginates results via limit and offset', () => {
    const page1 = handleListControls({ framework_id: 'julkri', limit: 1, offset: 0 });
    const page2 = handleListControls({ framework_id: 'julkri', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();
    expect(page2.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    const text2 = page2.content[0].text;

    // Both pages report the full total_results
    expect(text1).toContain('total_results: 79');
    expect(text2).toContain('total_results: 79');

    // The two pages return different controls
    expect(text1).not.toBe(text2);
  });
});
