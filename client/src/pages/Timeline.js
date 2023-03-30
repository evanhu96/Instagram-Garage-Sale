import { QUERY_POSTS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import InstaCard from "../components/InstaCard";

export default function Timeline() {
  const { loading, data, error } = useQuery(QUERY_POSTS);
  if (data) {
    console.log(data);
  }
  return (
    <>
      {data && (
        <div>
          {data.posts.map((post) => {
            console.log(post.comments);
            return (
              <InstaCard
                key={post._id}
                comments={post.comments}
                imageSrc={post.post}
                caption={post.description}
                user={post.username}
                profilePic = {post.profilePic}
                post = {post._id}
                timestamp = {post.date}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
