
const CommentCard = ({ comment, role }) => {
  const { userId, commentText, createdAt } = comment;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4 flex items-start">
      <div className="flex-shrink-0">
        {/* Avatar Placeholder */}
        <img
          src={userId?.avatar || "/default-avatar.jpg"} // Assuming user has an avatar, fallback to default
          alt={userId?.name || "User Avatar"}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-center justify-between">
          {/* User Name */}
          <span className="font-semibold text-lg text-gray-800">
            {userId?.name || "Anonymous"}
          </span>
          {/* Timestamp */}
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        {/* Comment Text */}
        <p className="text-gray-700 mt-2">{commentText}</p>
        <div className="flex mt-2 space-x-2">
          {/* Optionally, you can add action buttons like 'Like' or 'Reply' */}
          {role === "admin" && (
            <button
              onClick={() => alert("Action: Approve or Delete comment")}
              className="bg-blue-500 text-white py-1 px-4 rounded-md text-sm"
            >
              Admin Action
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
