import { compare } from "bcrypt";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post does not exists.");

  const comment = await Comment.create({
    content,
    post: req.params?.id,
    author: req.user?._id,
  });

  if (!comment)
    throw new ApiError(500, "Something went wrong while creating the comment.");

  res
    .status(201)
    .json(new ApiResponse(200, comment, "Comment Successfully created."));
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const { post_id } = req.query;
  const post = await Post.findById(post_id);
  if (!post) throw new ApiError(404, "Post does not exists.");

  const comments = await Comment.find({ post: post_id })
    .populate("author", "fullName avatar createdAt updatedAt")
    .sort({ createdAt: -1 });

  if (!comments) throw new ApiError(404, "No Comments found.");

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully."));
});

const getCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError("400", "Provide the id in the parameters.");

  const comment = await Comment.findById(id).populate(
    "author",
    "fullName avatar createdAt updatedAt"
  );

  if (!comment) throw new ApiError(404, "No comment found");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment found successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Please provide the content.");

  const comment = await Comment.find({
    _id: req.params?.id,
    author: req.user?._id,
  });

  if (!comment)
    throw new ApiError(
      404,
      "Comment not found or you are not the author of that comment."
    );

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: req.params?.id,
      author: req.user?._id,
    },
    {
      content,
    },
    {
      new: true,
    }
  );

  if (!updatedComment)
    throw new ApiError(500, "Something went wrong while updating the comment.");

  res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = Comment.find({ _id: req.params.id, author: req.user?._id });

  if (!comment)
    throw new ApiError(
      404,
      "Comment not found or you are not the author of it."
    );

  await Comment.deleteOne({ _id: req.params.id, author: req.user?._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully."));
});

export {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
