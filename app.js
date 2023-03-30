const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
app.use(cors());

app.options("*", cors());

require("dotenv/config");

const api = process.env.API_URL;
const productsRouter = require("./routers/products");

const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const orderRouter = require("./routers/orders");

//Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJWT());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log(`server is running on http://localhost:3000`);
});
