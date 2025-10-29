import mongoose, {Schema} from 'mongoose';

const postSchema = await new Schema({
    title:{
        type:String,
        required: true,
        trim: true,   
    },
    content:{
        type:String,
        required: true,
        trim: true,   
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User" 
    },
},{timestamps: true});

export const Post = mongoose.model("Post", postSchema);