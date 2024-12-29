const CommentCard = ({ comment }) => {
  return (
    <div className="comment-card mb-4 p-4 border rounded shadow-sm">
      <p className="text-gray-700 mb-1">{comment.comment}</p>
      <p className="text-sm text-gray-500">
        <strong>{comment.userId.name}</strong> - {comment.userId.role || "User"}
      </p>
    </div>
  );
};

export default CommentCard;
