import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import React, { useState } from "react";
import UpvoteSection from "../components/UpvoteSection";
import PostButtons from "../components/PostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>query failed</div>;
  }

  return (
    <Layout>
      {!fetching && data ? (
        <Stack spacing={8}>
          {data.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <Box>
                  <UpvoteSection post={post} />
                </Box>
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by {post.creator.username}</Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
                <PostButtons postId={post.id} creatorId={post.creator.id} />
              </Flex>
            )
          )}
        </Stack>
      ) : (
        <div>loading...</div>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            colorScheme="teal"
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
