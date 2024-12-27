
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="card mb-4">
      <h2>{post.title}</h2>
      <p>{post.discription}</p>
      <Link to={`/post/${post._id}`} className="text-blue-500">
        Read more
      </Link>
    </div>
  );
};

export default PostCard;
