import {_any, _case} from "../src";
import {_expr} from "../dist";

describe('_case', () => {
  it('handles any match correctly', () => {
    const testString: string = 'foo';
    const result: unknown = _case(testString).of(
      _any(expression => expression)
    );
    expect(result).toEqual(testString);
  });
  it('finds correct match', () => {
    const testString: string = 'foo';
    const result: unknown = _case(testString).of(
      _expr({foo: 'foo'}, expression => expression),
      _expr(true, expression => expression),
      _expr('foo', expression => expression),
      _expr(1, expression => expression)
    );
    expect(result).toEqual(testString);
  });
  it('fails when no match is found', () => {
    try {
      _case('foo').of(
        _expr('bar', expression => expression)
      )
      _case('foo').of(
        [() => 1, () => 1]
      )
    } catch (e) {
      expect(e.message).toContain('No match for the expression');
    }
  });
});