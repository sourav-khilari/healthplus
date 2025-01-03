import mongoose from "mongoose";

// const CommentSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Doctor",
//     },
//     comment: {
//       type: String,
//       required: true,
//     },
//     postId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Post",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );



const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "doctor"], // Specify the role of the commenter
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);


export const Comment = mongoose.model("Comment", CommentSchema);





const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor", // Store doctor IDs who commented
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", PostSchema);
