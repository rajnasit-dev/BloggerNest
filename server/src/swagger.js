// src/swaggerSchemas.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string }
 *         content: { type: string }
 *         author: { type: string }
 *         createdAt: { type: string, format: date-time }
 *     NewPost:
 *       type: object
 *       required: [title, content]
 *       properties:
 *         title: { type: string }
 *         content: { type: string }
 *         coverImage: { type: string, format: binary }
 *     UpdatePost:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         content: { type: string }
 *         coverImage: { type: string, format: binary }
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         content: { type: string }
 *         author: { type: string }
 *         post: { type: string }
 *         createdAt: { type: string, format: date-time }
 *     NewComment:
 *       type: object
 *       required: [content]
 *       properties:
 *         content: { type: string }
 *     UpdateComment:
 *       type: object
 *       properties:
 *         content: { type: string }
 *
 *     RegisterUser:
 *       type: object
 *       required: [username, email, password]
 *       properties:
 *         username: { type: string }
 *         email: { type: string, format: email }
 *         password: { type: string, format: password }
 *         avatar: { type: string, format: binary }
 *     LoginUser:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email }
 *         password: { type: string, format: password }
 *     ChangePassword:
 *       type: object
 *       required: [oldPassword, newPassword]
 *       properties:
 *         oldPassword: { type: string, format: password }
 *         newPassword: { type: string, format: password }
 *     UpdateAccount:
 *       type: object
 *       properties:
 *         username: { type: string }
 *         email: { type: string, format: email }
 */
// src/swagger.js
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BloggerNest API",
      version: "1.0.0",
      description: "API documentation for BloggerNest – a full-featured blogging system",
    },
    servers: [
      { url: "http://localhost:3000/api/v1" },   // <-- note the trailing slash is optional
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }], // apply globally (you can override per route)
  },
  // **All route files** – use glob pattern
  apis: [
    path.join(__dirname, "routes", "*.routes.js"), // adjust folder name if needed
  ],
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app) => {
  // Serve the UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { persistAuthorization: true },
    })
  );

  // Optional: raw spec endpoint
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
};