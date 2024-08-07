import express from "express";
import {
  FetchUserById,
  Login,
  register,
} from "../controllers/users/user.controllers.js";
import Auth from "../middlewares/jwtAuth.middleware.js";

const UserRoutes = express.Router();

UserRoutes.post("/register", (req, res) => register(req, res));
UserRoutes.post("/login", (req, res) => {
  Login(req, res);
});
UserRoutes.get("/me", Auth, (req, res) => {
  FetchUserById(req, res);
});

export { UserRoutes };
