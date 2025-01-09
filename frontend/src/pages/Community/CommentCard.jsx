const CommentCard = ({ comment }) => {
  const { userId, role, comment: commentText, createdAt } = comment;

  // Format the creation date
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 flex items-start">
      <div className="flex-shrink-0">
        {/* Avatar Placeholder */}
        <img
          src={userId?.avatar || "/default-avatar.jpg"} // User's avatar or a default one
          alt={userId?.name || "User Avatar"}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-center justify-between">
          {/* Display user's name and role */}
          <div>
            <span className="font-semibold text-lg text-gray-800">
              {userId?.name || "Anonymous"}
            </span>
            <span className="ml-2 text-sm text-gray-600">({role})</span>
          </div>
          {/* Display the creation timestamp */}
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        {/* Display the comment text */}
        <p className="text-gray-700 mt-2">{commentText}</p>
      </div>
    </div>
  );
};

export default CommentCard;
