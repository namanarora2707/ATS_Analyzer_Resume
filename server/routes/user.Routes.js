import express from "express";
import { signUp, login, getAllUsers } from "../controller/userController.js";
import { verifyToken } from "../config/isAuth.js";

const userRouter = express.Router();

userRouter.get("/allusers", verifyToken, getAllUsers);
userRouter.post("/signup", signUp);
userRouter.post("/login", login);

export default userRouter;
