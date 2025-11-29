require("dotenv").config();
const express = require("express");
const app = express();
const productsRouter = require("./routes/products");

app.use(express.json());
app.use("/api/products", productsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
