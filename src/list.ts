type ListFn = <Item = unknown>(array: Item[]) => [Item, Item[]];

/**
 * Returns array of structure similar to Erlang array
 * @param array
 */
const list: ListFn = (array) => {
  return [array[0], array.slice(1)];
};

export { list }