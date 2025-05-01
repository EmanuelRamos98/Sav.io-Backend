import express from "express";
import {
    forgotPasswordController,
    loginController,
    registerController,
    updatePasswordController,
    verifyEmailController,
} from "../controllers/auth.controller.js";

const auhtRoute = express.Router();

auhtRoute.get("/verify-email/:token_validation", verifyEmailController);
auhtRoute.put("/password/:token_recuperation", updatePasswordController);
auhtRoute.post("/forgot-password", forgotPasswordController);
auhtRoute.post("/register", registerController);
auhtRoute.post("/login", loginController);

export default auhtRoute;
