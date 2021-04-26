import {caseSpecification, PREDICATE_EXPR_ANY} from '../src';

describe('caseSpecification', () => {
  it('handles any match correctly', () => {
    const testString: string = 'foo';
    const result: unknown = caseSpecification(testString, [
      [PREDICATE_EXPR_ANY, expression => expression],
    ]);
    expect(result).toEqual(testString);
  });
  it('finds correct match', () => {
    const testString: string = 'foo';
    const result: unknown = caseSpecification(testString, [
      [{foo: 'foo'}, expression => expression],
      [true, expression => expression],
      ['foo', expression => expression],
      [1, expression => expression]
    ]);
    expect(result).toEqual(testString);
  });
  it('fails when no match was found', () => {
    try {
      caseSpecification('foo', [
        ['bar', expression => expression]
      ]);
    } catch (e) {
      expect(e.message).toContain('No match for the expression');
    }
  });
});
