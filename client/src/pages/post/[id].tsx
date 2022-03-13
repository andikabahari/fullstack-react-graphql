import { Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPost } from "../../utils/useGetPost";

const Post: React.FC<{}> = ({}) => {
  const [{ data, error, fetching }] = useGetPost();

  if (fetching) {
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
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
