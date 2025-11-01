// src/routes/user.routes.js
import { Router } from "express";
import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  changeCurrentPassword,
  logoutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User created
 */
router.route("/register").post(upload.single("avatar"), registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Tokens returned
 */
router.route("/login").post(upload.none(), loginUser);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout (invalidates refresh token)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */
router.route("/logout").post(verifyJWT, logoutUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 */
router.post("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password updated
 */
router.post("/change-password", verifyJWT, changeCurrentPassword);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User object
 */
router.get("/", verifyJWT, getCurrentUser);

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update account details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccount'
 *     responses:
 *       200:
 *         description: Updated user
 */
router.patch("/update", verifyJWT, updateAccountDetails);

/**
 * @swagger
 * /users/update-avatar:
 *   patch:
 *     summary: Update avatar image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated
 */
router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;