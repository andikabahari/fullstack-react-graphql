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

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({ variables: { limit: 10 } });

  if (!fetching && !data) {
    return <div>Query failed.</div>;
  }

  return (
    <Layout>
      <Flex mb={8} alignItems="center">
        <Heading>Post List</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create a new post</Link>
        </NextLink>
      </Flex>
      {!fetching && data ? (
        <Stack spacing={8}>
          {data.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <div>loading...</div>
      )}
      {data ? (
        <Flex>
          <Button colorScheme="teal" isLoading={fetching} m="auto" my={8}>
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
