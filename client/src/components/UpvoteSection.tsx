import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  return (
    <Flex
      height="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton aria-label="Upvote post" icon={<ChevronUpIcon />} />
      {post.points}
      <IconButton aria-label="Downvote post" icon={<ChevronDownIcon />} />
    </Flex>
  );
};

export default UpvoteSection;
