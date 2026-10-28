const products = [];
let nextId = 1;

function addProduct(name, price, stock) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Product name is required");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be a number greater than zero");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a non-negative whole number");
  }

  const product = {
    id: nextId++,
    name: name.trim(),
    price,
    stock
  };

  products.push(product);
  return product;
}

function getProducts() {
  return [...products];
}

function getInventoryValue() {
  return products.reduce((total, product) => total + product.price * product.stock, 0);
}

function resetInventoryForTests() {
  products.length = 0;
  nextId = 1;
}

module.exports = {
  addProduct,
  getProducts,
  getInventoryValue,
  resetInventoryForTests
};
