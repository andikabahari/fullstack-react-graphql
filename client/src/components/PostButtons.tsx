import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface PostButtonsProps {
  postId: number;
  creatorId: number;
}

const PostButtons: React.FC<PostButtonsProps> = ({ postId, creatorId }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Flex alignItems="center">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton as={Link} aria-label="Edit post" icon={<EditIcon />} />
      </NextLink>
      <IconButton
        onClick={() => deletePost({ id: postId })}
        aria-label="Delete post"
        icon={<DeleteIcon />}
      />
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(PostButtons);
