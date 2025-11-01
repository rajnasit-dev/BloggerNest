// src/routes/comment.routes.js
import { createComment, deleteComment, getCommentById, getCommentsByPost, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comment]
 *     parameters:
 *       - in: query
 *         name: post_id
 *         schema: { type: string }
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get("/", getCommentsByPost); // ?post_id

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a single comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.get("/:id", getCommentById);

/**
 * @swagger
 * /comments/create/{id}:
 *   post:
 *     summary: Create a new comment (requires auth)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewComment'
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/create/:id", verifyJWT, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comment]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *     responses:
 *       200:
 *         description: Updated comment
 */
router.put("/:id", verifyJWT, updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Comment deleted
 */
router.delete("/:id", verifyJWT, deleteComment);

export default router;