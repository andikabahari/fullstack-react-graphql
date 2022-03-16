import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import React from "react";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
import { isServer } from "../utils/isServer";

interface PostButtonsProps {
  postId: number;
  creatorId: number;
}

export const PostButtons: React.FC<PostButtonsProps> = ({
  postId,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery({ skip: isServer() });

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Flex alignItems="center">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton as={Link} aria-label="Edit post" icon={<EditIcon />} />
      </NextLink>
      <IconButton
        onClick={() => deletePost({ variables: { id: postId } })}
        aria-label="Delete post"
        icon={<DeleteIcon />}
      />
    </Flex>
  );
};
