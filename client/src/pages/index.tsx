import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10 } });
  return (
    <>
      <NavBar></NavBar>
      <div>Hello, World!</div>
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
