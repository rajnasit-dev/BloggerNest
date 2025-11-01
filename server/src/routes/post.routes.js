// src/routes/post.routes.js
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: List all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Array of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a single post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Post object
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/NewPost'
 *     responses:
 *       201:
 *         description: Post created
 */
router.post("/create", verifyJWT, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Updated post
 */
router.put("/:id", verifyJWT, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Post deleted
 */
router.delete("/:id", verifyJWT, deletePost);

export default router;