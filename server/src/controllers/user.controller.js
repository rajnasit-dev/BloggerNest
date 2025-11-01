import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  if (!req.body)
    throw new ApiError(400, "Post request requires the some data to be sent.");

  const { fullName, email, password } = req.body;

  if ([fullName, password, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required.");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user.");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  if (!req.body)
    throw new ApiError(400, "Post request requires the some data to be sent.");

  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User does not exist.");

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) throw new ApiError(401, "Invalid user credentials!");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,
        { 
          user: loggedInUser,
          accessToken,
          refreshToken 
        },
        "User Logged In Succesfully."
      )
    );
});

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User Logged Out."))
})


const refreshAccessToken = asyncHandler(async(req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized Request.");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = User.findById(decodedToken?._id);
  
    if(!user) throw new ApiError(401, "Invalid Refresh token.");
  
    if(incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used.");
    } 
    
    const options = {
      httpOnly: true,
      secure: true
    }
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    return res.
    status(200)
    .cookie('accessToken',accessToken)
    .cookie('refreshToken',newRefreshToken)
    .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed"))
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
