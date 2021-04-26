# erl-case-of
Just some Erlang case/of implementation in TypeScript.

## How to

```ts
_case('foo').of(
  _expr('baz', _ => 'custom'),
  _expr('foo', expr => expr),
  _any(expr => expr)
)
```