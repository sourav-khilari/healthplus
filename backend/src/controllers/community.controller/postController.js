// import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";
import { Post } from "../../models/community.model/postModel.js";
import { Comment } from "../../models/community.model/postModel.js";
import { Notification } from "../../models/community.model/notification.model.js"
// desc : create a post
// route :
const createPost = async (req, res) => {
  // Get data from req body: title, discription, and image (optional)
  const { title, discription } = req.body;
  const _id=req.user._id
  console.log(req.body);
  console.log("\n\ntitle="+title);


  // Check if title and discription are present
  if (!title || !discription) {
    console.log("ist if");
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
    userPostImage = await uploadOnCloudinary(postLocalImage);

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

// const addcomment = async (req, res) => {
//   const { postId, comment } = req.body;
//   const { _id, role } = req.user; // Assuming `req.user` contains `userId` and `role`
//   const userId=_id;

//   if (!comment || !postId) {
//     return res.status(400).send({
//       success: false,
//       message: "Post ID and comment are required.",
//     });
//   }

//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).send({
//         success: false,
//         message: "Post not found.",
//       });
//     }

//     // Validate permissions
//     if (role === "user" && post.userId.toString() !== userId) {
//       return res.status(403).send({
//         success: false,
//         message: "Only the post owner can comment on this post.",
//       });
//     }

//     if (role === "doctor") {
//       const isDoctor = await Doctor.exists({ _id: userId });
//       if (!isDoctor) {
//         return res.status(403).send({
//           success: false,
//           message: "Only doctors can comment on this post.",
//         });
//       }
//     }

//     // Create and save the comment
//     const newComment = new Comment({
//       userId,
//       role,
//       comment,
//       postId,
//     });

//     await newComment.save();

//     return res.status(201).send({
//       success: true,
//       message: "Comment added successfully.",
//       data: newComment,
//     });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };

// Import the Notification model



const sendNotifications = async (post, currentUserId, role) => {
  try {
    const notifications = [];

    // Notify post owner (if the commenter isn't the post owner)
    if (post.userId.toString() !== currentUserId) {
      notifications.push({
        recipientId: post.userId,
        message: `Your post has a new comment.`,
        link: `/posts/${post._id}`,
      });
    }

    // Notify other doctors who have commented on the post (exclude current commenter)
    if (role === "doctor") {
      for (const doctorId of post.comments) {
        if (doctorId.toString() !== currentUserId) {
          notifications.push({
            recipientId: doctorId,
            message: `A new comment has been added to a post you commented on.`,
            link: `/posts/${post._id}`,
          });
        }
      }
    }

    // Save notifications to the database
    await Notification.insertMany(notifications);

    console.log("Notifications saved successfully:", notifications);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};



const addcomment = async (req, res) => {
  const { postId, comment } = req.body;
  const { _id, role } = req.user; // Assuming `req.user` contains `userId` and `role`
  const userId = _id;
  if (!comment || !postId) {
    return res.status(400).send({
      success: false,
      message: "Post ID and comment are required.",
    });
  }

  try {
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found.",
      });
    }

    // Validate permissions
    if (role === "user" && post.userId.toString() != userId) {
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
    const newComment = await Comment.create({
      userId,
      role,
      comment,
      postId,
    });
    await newComment.save();
    // Add doctor ID to post's comments array if not already present
    if (role === "doctor" && !post.comments.includes(userId)) {
      post.comments.push(userId);
      await post.save();
    }

    // Notify post owner and doctors
    await sendNotifications(post, userId, role);

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
  const { _id } = req.user; // Assuming userId is available in req.user
  const userId = _id
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

const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("userId", "name email") // Populate user details
      .populate("comments", "name email"); // Populate doctor details

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).send({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getNotifications = async (req, res) => {
  const { _id } = req.user; // Assuming `req.user` contains the logged-in user's ID
  const userId = _id
  try {
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 }) // Sort notifications by the most recent
      .limit(20); // Optional: Limit the number of notifications

    return res.status(200).send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
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



const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { _id, role } = req.user; // Assuming `req.user` contains userId and role
  const userId = _id;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found.",
      });
    }

    // Validate permissions
    if (role != admin) {
      if (post.userId.toString() !== userId) {
        return res.status(403).send({
          success: false,
          message: "You are not authorized to delete this post.",
        });
      }
    }
    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Delete associated comments
    await Comment.deleteMany({ postId });

    return res.status(200).send({
      success: true,
      message: "Post and associated comments deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting post and comments:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
};

export {
  createPost,
  getAllPosts,
  addcomment,
  getUserPosts,
  getPostById,
  getNotifications,
  deletePost,
}
