// import User from "../models/userModel.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { Post } from "../../models/community.model/postModel.js";
import { Comment } from "../../models/community.model/postModel.js";
// desc : create a post
// route :
const createPost = async (req, res) => {
  // Get data from req body: title, discription, and image (optional)
  const { title, discription, _id } = req.body;
  console.log(req.body);

  // Check if title and discription are present
  if (!title || !discription) {
    return res.status(400).send({
      success: false,
      message: "Title and discription are required.",
    });
  }

  // If image is provided, upload it to Cloudinary
  let postLocalImage;
  if (
    req.files &&
    Array.isArray(req.files.image) &&
    req.files.image.length > 0
  ) {
    postLocalImage = req.files.image[0].path;
  }

  let userPostImage;

  try {
    // Upload avatar to Cloudinary and get the URL
    userPostImage = await uploadToCloudinary(postLocalImage);

    // Check if avatar upload was successful
    if (!userPostImage || !userPostImage.url) {
      return res.status(500).send({
        success: false,
        message: "Error uploading avatar",
      });
    }
    const PostData = {};
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }

  const postResponse = new Post({
    title,
    discription,
    image: userPostImage.url,
    userId: _id,
  });

  await postResponse.save();

  // Send a success response
  return res.status(200).send({
    success: true,
    message: "Post created successfully.",
    data: {
      title,
      discription,
      image: userPostImage.url, // Assuming the URL is available in userPostImage
    },
  });
};

// const getAllPost = async (req, res) => {
//   try {
//     // Get all posts from the database
//     const allPosts = await Post.find({});

//     // Check if there are no posts
//     if (!allPosts || allPosts.length === 0) {
//       return res.status(404).send({
//         success: false,
//         message: "No posts found.",
//       });
//     }
//     const postsWithComments = await Promise.all(
//       allPosts.map(async (post) => {
//         const comments = await Comment.find({ postId: post._id });
//         return {
//           ...post._doc,
//           comments,
//         };
//       })
//     );
//     // Return the posts in the response
//     return res.status(200).send({
//       success: true,
//       message: "All posts retrieved successfully.",
//       allPosts: postsWithComments,
//     });
//   } catch (error) {
//     console.error("Error getting all posts:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };


// export const getAPostById = async (req, res) => {
//   const postId = req.params.postId;
//   const idValue = postId.split("=")[1];
//   console.log(idValue);

//   const post = await Post.findById(idValue);
//   console.log(post);
// };

const addcomment = async (req, res) => {
  const { postId, comment } = req.body;
  const { _id, role } = req.user; // Assuming `req.user` contains `userId` and `role`
  const userId=_id;

  if (!comment || !postId) {
    return res.status(400).send({
      success: false,
      message: "Post ID and comment are required.",
    });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found.",
      });
    }

    // Validate permissions
    if (role === "user" && post.userId.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: "Only the post owner can comment on this post.",
      });
    }

    if (role === "doctor") {
      const isDoctor = await Doctor.exists({ _id: userId });
      if (!isDoctor) {
        return res.status(403).send({
          success: false,
          message: "Only doctors can comment on this post.",
        });
      }
    }

    // Create and save the comment
    const newComment = new Comment({
      userId,
      role,
      comment,
      postId,
    });

    await newComment.save();

    return res.status(201).send({
      success: true,
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};



const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("userId", "name email") // Populate post owner details
      .populate({
        path: "comments",
        options: { sort: { createdAt: 1 } }, // Sort comments by createdAt
        populate: {
          path: "userId",
          select: "name email role", // Populate commenter details
          model: function (doc) {
            return doc.role === "doctor" ? "Doctor" : "User";
          },
        },
      });

    return res.status(200).send({
      success: true,
      message: "Posts retrieved successfully.",
      data: posts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};


const getUserPosts = async (req, res) => {
  const { userId } = req.user; // Assuming userId is available in req.user

  try {
    // Find posts created by the user
    const userPosts = await Post.find({ userId })
      .populate("userId", "name email") // Populate post owner details
      .populate({
        path: "comments",
        options: { sort: { createdAt: 1 } }, // Sort comments by creation time
        populate: {
          path: "userId",
          select: "name email role", // Populate commenter details
          model: function (doc) {
            return doc.role === "doctor" ? "Doctor" : "User";
          },
        },
      });

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No posts found for this user.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User posts retrieved successfully.",
      data: userPosts,
    });
  } catch (error) {
    console.error("Error retrieving user posts:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};



// const addcomment = async (req, res) => {
//   const { postId, comment, userId } = req.body;

//   const newComment = new Comment({
//     userId,
//     comment,
//     postId,
//   });

//   const addedComment = await newComment.save();
//   if (!addedComment) {
//     res.status(500).send({
//       success: false,
//       message: "Error adding comment",
//     });
//   }

//   return res.status(201).send({
//     success: true,
//     message: "Comment added successfully",
//     comment,
//   });

//   // const post = await Post.findById(idValue);
//   // console.log(post);
// };


export{
  createPost,
  getAllPosts,
  addcomment,
  getUserPosts,
}
