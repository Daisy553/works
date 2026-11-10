(function (root, factory) {
  const helpers = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = helpers;
  }

  root.DAISY_PORTFOLIO_STATE = helpers;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function getInitialCategoryId(portfolio) {
    if (!portfolio || !Array.isArray(portfolio.categories) || portfolio.categories.length === 0) {
      return '';
    }

    return portfolio.categories[0] && portfolio.categories[0].id ? portfolio.categories[0].id : '';
  }

  function getCategoryItems(portfolio, categoryId) {
    if (!portfolio || !Array.isArray(portfolio.items)) {
      return [];
    }

    return portfolio.items.filter((item) => item && item.category === categoryId);
  }

  function normalizeAlbumIndex(index, length) {
    if (!Number.isFinite(length) || length <= 0) {
      return 0;
    }

    const normalizedLength = Math.trunc(length);

    if (normalizedLength <= 0) {
      return 0;
    }

    const normalizedIndex = Number.isFinite(index) ? Math.trunc(index) : 0;

    return ((normalizedIndex % normalizedLength) + normalizedLength) % normalizedLength;
  }

  function getAdjacentAlbumItems(items, index) {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        previous: null,
        current: null,
        next: null,
      };
    }

    const currentIndex = normalizeAlbumIndex(index, items.length);
    const previousIndex = normalizeAlbumIndex(currentIndex - 1, items.length);
    const nextIndex = normalizeAlbumIndex(currentIndex + 1, items.length);

    return {
      previous: items[previousIndex],
      current: items[currentIndex],
      next: items[nextIndex],
    };
  }

  return {
    getCategoryItems,
    getAdjacentAlbumItems,
    normalizeAlbumIndex,
    getInitialCategoryId,
  };
});
