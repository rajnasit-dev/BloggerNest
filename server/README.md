# 📝 Blog Application REST API

## 📌 Project ID: SCR845NGFF
**Developed during Backend Developer Internship at InnoBytes Services**

A RESTful API for a blog application built with **Node.js**, **Express.js**, and **MongoDB**.  
This API allows users to **create, read, update, and delete blog posts and comments**, with full **authentication and authorization** using **JWT**.

---

## 🚀 Features

- 🧑‍💻 User Registration & Login (JWT Authentication)
- 📰 Create, Read, Update, Delete (CRUD) for Blog Posts
- 💬 Manage Comments for Each Post
- 🔐 Role-Based Access Control (Authenticated Actions)
- ⚙️ Input Validation & Error Handling
- 🧠 Unit & Integration Testing
- 📘 Swagger API Documentation
- 🧹 Clean and Refactored Codebase

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Language** | Node.js (JavaScript) |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JSON Web Token (JWT) |
| **Testing** | Jest / Supertest |
| **Documentation** | Swagger |
| **Version Control** | Git + GitHub |

---

## 🗄️ Database Schema

### **Users**
| Field | Type | Description |
|--------|------|-------------|
| id | ObjectId | Unique User ID |
| username | String | User’s name |
| email | String | User’s email |
| password | String | Hashed password |
| avatar | String | User's Avatar |
| created_at | Date | Creation date |
| updated_at | Date | Last update date |

### **Posts**
| Field | Type | Description |
|--------|------|-------------|
| id | ObjectId | Unique Post ID |
| title | String | Title of the post |
| content | String | Content of the post |
| author | ObjectId | Reference to User |
| created_at | Date | Creation date |
| updated_at | Date | Last update date |

### **Comments**
| Field | Type | Description |
|--------|------|-------------|
| id | ObjectId | Unique Comment ID |
| post | ObjectId | Reference to Post |
| content | String | Comment text |
| author | ObjectId | Reference to User |
| created_at | Date | Creation date |
| updated_at | Date | Last update date |

---

## ⚙️ API Endpoints

### 🧑‍💼 User API Endpoints

| Method | Endpoint | Description | Auth Required |
|:-------|:----------|:-------------|:---------------|
| **POST** | `/api/v1/users/register` | Register a new user with optional avatar upload | ❌ No |
| **POST** | `/api/v1/users/login` | Login user and get access & refresh tokens | ❌ No |
| **POST** | `/api/v1/users/logout` | Logout user and invalidate refresh token | ✅ Yes |
| **POST** | `/api/v1/users/refresh-token` | Refresh and get new access token using refresh token | ❌ No |
| **POST** | `/api/v1/users/change-password` | Change the current password | ✅ Yes |
| **GET** | `/api/v1/users/` | Get current user profile | ✅ Yes |
| **PATCH** | `/api/v1/users/update` | Update user account details | ✅ Yes |
| **PATCH** | `/api/v1/users/update-avatar` | Update user avatar (image) | ✅ Yes |

### 📝 Post/Blog Endpoints

| Method | Endpoint | Description | Auth |
|:-------|:----------|:-------------|:------|
| **GET** | `/posts` | Get all posts | ❌ |
| **GET** | `/posts/{id}` | Get post by ID | ❌ |
| **POST** | `/posts/create` | Create a new post | ✅ |
| **PUT** | `/posts/{id}` | Update an existing post | ✅ |
| **DELETE** | `/posts/{id}` | Delete a post | ✅ |


---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rajnasit-dev/BloggerNest.git
cd BloggerNest
