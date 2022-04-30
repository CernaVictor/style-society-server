import { Request, Response, Router } from "express";
import { getRepository, getConnection } from "typeorm";
import Users from "../entities/Users";

const getUsers = async (req: Request, res: Response) => {
  try {
    const { isAdmin } = req.query;
    const users = await Users.find({
      where: {
        ...(isAdmin ? { isAdmin } : undefined),
      },
    });

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Ahh...Something went wrong" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productsRepository = getRepository(Users);
  try {
    const user = await productsRepository.delete(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

const router = Router();

router.get("/all", getUsers);
router.delete("/delete/:id", deleteUser);

export { router as userRouter };
