const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const {
  addProduct,
  getProducts,
  getInventoryValue
} = require("./inventory");

const publicDir = path.join(__dirname, "public");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(publicDir, "index.html")));
  }

  if (req.method === "GET" && url.pathname === "/api/products") {
    return sendJson(res, 200, getProducts());
  }

  if (req.method === "GET" && url.pathname === "/api/summary") {
    return sendJson(res, 200, {
      totalProducts: getProducts().length,
      inventoryValue: getInventoryValue()
    });
  }

  if (req.method === "POST" && url.pathname === "/api/products") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 100_000) {
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const product = addProduct(
          data.name,
          Number(data.price),
          Number(data.stock)
        );
        return sendJson(res, 201, product);
      } catch (error) {
        return sendJson(res, 400, { error: error.message || "Invalid request" });
      }
    });
    return;
  }

  return sendJson(res, 404, { error: "Route not found" });
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`Inventory Manager running at http://localhost:${port}`);
  });
}

module.exports = server;
