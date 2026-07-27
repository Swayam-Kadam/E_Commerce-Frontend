/** Normalize product.category whether it is a string or populated Category object */
export const getCategoryName = (category) => {
  if (!category) return '';
  if (typeof category === 'object') {
    return category.name || '';
  }
  return String(category);
};

export const getCategoryId = (category) => {
  if (!category) return null;
  if (typeof category === 'object') {
    return category._id || null;
  }
  return category;
};

export const categoriesFromProducts = (products = []) => {
  const names = products
    .map((product) => getCategoryName(product.category))
    .filter((name) => name && name.trim() !== '');
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
};

export const matchesCategory = (productCategory, selectedCategory) => {
  if (!selectedCategory || selectedCategory === 'All') return true;
  return (
    getCategoryName(productCategory).toLowerCase() ===
    String(selectedCategory).toLowerCase()
  );
};
