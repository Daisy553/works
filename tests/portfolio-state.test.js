const assert = require('assert');

const {
  getCategoryItems,
  getAdjacentAlbumItems,
  normalizeAlbumIndex,
  getInitialCategoryId,
} = require('../portfolio-state.js');

const data = {
  categories: [
    { id: 'commercial', label: 'Commercial' },
    { id: 'personal', label: 'Personal' },
  ],
  items: [
    { id: 'a', category: 'commercial' },
    { id: 'b', category: 'commercial' },
    { id: 'c', category: 'commercial' },
    { id: 'd', category: 'personal' },
  ],
};

const commercialItems = data.items.slice(0, 3);

assert.strictEqual(getInitialCategoryId(data), 'commercial');
assert.deepStrictEqual(
  getCategoryItems(data, 'commercial').map((item) => item.id),
  ['a', 'b', 'c'],
);
assert.deepStrictEqual(getCategoryItems(data, 'missing'), []);
assert.strictEqual(normalizeAlbumIndex(3, 3), 0);
assert.strictEqual(normalizeAlbumIndex(-1, 3), 2);
assert.strictEqual(normalizeAlbumIndex(4, 0), 0);
assert.strictEqual(normalizeAlbumIndex(undefined, 3), 0);
assert.strictEqual(normalizeAlbumIndex(Number.NaN, 3), 0);
assert.strictEqual(normalizeAlbumIndex(Infinity, 3), 0);
assert.deepStrictEqual(getAdjacentAlbumItems(commercialItems, 0), {
  previous: commercialItems[2],
  current: commercialItems[0],
  next: commercialItems[1],
});
assert.deepStrictEqual(getAdjacentAlbumItems(commercialItems, undefined), {
  previous: commercialItems[2],
  current: commercialItems[0],
  next: commercialItems[1],
});

console.log('portfolio state helpers passed');
