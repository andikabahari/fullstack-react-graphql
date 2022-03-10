import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

type LoadingStatus = "upvote-loading" | "downvote-loading" | "not-loading";

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<LoadingStatus>("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex
      height="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoading("upvote-loading");
          await vote({ postId: post.id, value: 1 });
          setLoading("not-loading");
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loading === "upvote-loading"}
        aria-label="Upvote post"
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoading("downvote-loading");
          await vote({ postId: post.id, value: -1 });
          setLoading("not-loading");
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loading === "downvote-loading"}
        aria-label="Downvote post"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

export default UpvoteSection;
