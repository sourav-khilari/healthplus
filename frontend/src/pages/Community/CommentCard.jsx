

const CommentCard = ({ comment }) => {
  return (
    <div className="comment-card mb-2">
      <p>{comment.comment}</p>
      <p>
        <strong>{comment.userId.name}</strong> - {comment.role}
      </p>
    </div>
  );
};

export default CommentCard;
