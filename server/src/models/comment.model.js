import mongoose, {Schema} from 'mongoose';

const commentSchema = await new Schema({

},{timestamps: true});

export const Comment = mongoose.model("Comment", commentSchema);