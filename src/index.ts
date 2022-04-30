import cors = require("cors");
import express = require("express");
import { createConnection } from "typeorm";
import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/product";
import { userRouter } from "./routes/user";
import fileUpload = require("express-fileupload");

const app = express();

createConnection()
  .then(() => {
    app.use(express.json());
    app.use(
      fileUpload({
        createParentPath: true,
      })
    );
    app.use(express.static("uploads"));

    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
      })
    );

    app.get("/", (_req, res) => {
      res.send("Hello world!");
    });

    app.get("/toale_faine", (req, res) => {
      res.send([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    app.use("/auth", authRouter);
    app.use("/product", productRouter);
    app.use("/user", userRouter);

    app.listen(5000, async () => {
      console.log(`Server running on localhost:5000`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
