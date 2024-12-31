const CommentCard = ({ comment }) => {
  // Destructure the fields and provide defaults in case they are missing
  const { key = {}, comment: commentText = "", createdAt = "N/A" } = comment;

  return (
    <div className="comment-card mb-4 p-4 border rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="font-semibold text-lg">
            {key?.name || "Unknown User"}
          </p>
          <p className="text-sm text-gray-500">{userId?.role || "User"}</p>
        </div>
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      <p className="text-gray-700 mb-4">{commentText}</p>

      {/* Conditional rendering for admin */}
      {role === "admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => alert("Delete comment feature coming soon!")}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
