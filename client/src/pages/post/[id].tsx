import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../../components/Layout";
import { PostButtons } from "../../components/PostButtons";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPost } from "../../utils/useGetPost";
import { withApolloClient } from "../../utils/withApolloClient";

const Post: React.FC<{}> = ({}) => {
  const { data, error, loading } = useGetPost();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>Could not find post.</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      <Box mb={4}>{data?.post?.text}</Box>
      <PostButtons postId={data.post.id} creatorId={data.post.creator.id} />
    </Layout>
  );
};

export default withApolloClient({ ssr: true })(Post);
