const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addProduct,
  getProducts,
  getInventoryValue,
  resetInventoryForTests
} = require("./inventory");

test.beforeEach(() => {
  resetInventoryForTests();
});

test("adds a product with the correct details", () => {
  const product = addProduct("Wireless Mouse", 500, 3);

  assert.equal(product.name, "Wireless Mouse");
  assert.equal(product.price, 500);
  assert.equal(product.stock, 3);
  assert.equal(product.id, 1);
});

test("rejects an empty product name", () => {
  assert.throws(() => addProduct("", 500, 2), /Product name is required/);
});

test("rejects a zero or negative price", () => {
  assert.throws(() => addProduct("Keyboard", 0, 2), /Price must be a number/);
  assert.throws(() => addProduct("Keyboard", -10, 2), /Price must be a number/);
});

test("rejects negative or fractional stock", () => {
  assert.throws(() => addProduct("Keyboard", 500, -1), /Stock must be a non-negative/);
  assert.throws(() => addProduct("Keyboard", 500, 1.5), /Stock must be a non-negative/);
});

test("calculates total inventory value", () => {
  addProduct("Mouse", 500, 3);
  addProduct("Keyboard", 1000, 2);

  assert.equal(getInventoryValue(), 3500);
  assert.equal(getProducts().length, 2);
});
