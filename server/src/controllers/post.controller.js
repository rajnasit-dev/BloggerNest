import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPost = asyncHandler(async (req, res) => {
  const { content, title } = req.body;

  if (!content || !title)
    throw new ApiError(400, "title and content are required");

  const post = await Post.create({
    title,
    content,
    author: req.user?._id,
  });

  if (!post)
    throw new ApiError(500, "Something went wrong while creating the post.");

  return res
    .status(201)
    .json(new ApiResponse(200, post, "New Post created successfully."));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("author", "fullName avatar createdAt updatedAt")
    .sort({ createdAt: -1 });

  if (!posts) throw new ApiError(404, "No posts found");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts successfully fetched."));
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "fullName email"
  );

  if (!post) throw new ApiError(404, "Post not found");

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post found successfully."));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim())
    throw new ApiError(400, "Provide title and content.");

  const updatedPost = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      author: req.user?._id,
    },
    {
      $set: {
        title,
        content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPost)
    throw new ApiError(
      404,
      "Post not found or you dont have the permission to update it since you are not its author."
    );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params?.id,
    author: req.user?._id,
  });

  if (!post) {
    throw new ApiError(
      404,
      "Post not found or you dont have the permission to update it since you are not its author."
    );
  }

  await Post.deleteOne({
    _id: req.params?.id,
    author: req.user?._id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully."))
});

export { createPost, getAllPosts, getPostById, updatePost, deletePost };
