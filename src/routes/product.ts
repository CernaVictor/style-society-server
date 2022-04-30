import { Request, Response, Router } from "express";
import fileUpload = require("express-fileupload");
import { getRepository, getConnection } from "typeorm";
import Products from "../entities/Products";

const createProduct = async (req: Request, res: Response) => {
  const productsRepository = getRepository(Products);
  const { name, description, price, type, quantity } = req.body;
  const file: any = req.files.file;

  let errors: any = {};

  if (!name) errors.name = "Name must not be empty";
  if (!description) errors.description = "Description must not be empty";
  if (!price) errors.status = "Price must not be empty";
  if (!type) errors.status = "Type must not be empty";
  if (!quantity) errors.status = "Quantity must not be empty";

  if (
    type !== "watches" &&
    type !== "bracelets" &&
    type !== "sunglasses" &&
    type !== "perfume"
  )
    errors.type = "Type must be either watches bracelets sunglasses or perfume";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  try {
    const product = productsRepository.create({
      name,
      description,
      price,
      type,
      quantity,
    });
    let photo = "";

    if (file) {
      try {
        const uploadPath = `./uploads/${product.name}/${file.name}`;
        console.log(uploadPath);
        file.mv(uploadPath);
        photo = `http://localhost:5000/${product.name}/${file.name}`;
      } catch (error) {
        console.log(error);
      }
    }
    product.photo = photo;

    const result = await product.save();
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const products = await Products.find({
      where: {
        ...(type ? { type } : undefined),
      },
      order: {
        createDate: "DESC",
      },
    });

    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Ahh...Something went wrong" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productsRepository = getRepository(Products);
  try {
    await productsRepository.delete(id);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

const editProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity } = req.body;
  const { id } = req.params;
  const productsRepository = getRepository(Products);

  let errors: any = {};

  if (!name) errors.name = "Name must not be empty";
  if (!description) errors.description = "Description must not be empty";
  if (!price) errors.price = "Price must not be empty";
  if (!quantity) errors.quantity = "Quantity must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  try {
    const product = await productsRepository.findOneOrFail(id);
    console.log(product);
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;

    const result = await product.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "product not found" });
  }
};

const getSpecificProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productsRepository = getRepository(Products);

  try {
    const product = await productsRepository.findOneOrFail(id);
    console.log(product);
    return res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Ahh...Something went bad" });
  }
};

const router = Router();
router.post("/create", createProduct);
router.get("/all", getProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/edit/:id", editProduct);
router.get("/:id", getSpecificProduct);

export { router as productRouter };
