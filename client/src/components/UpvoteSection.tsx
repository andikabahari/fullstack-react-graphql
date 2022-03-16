import { ApolloCache } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import React, { useState } from "react";
import {
  Post,
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }

    const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: {
        points: newPoints,
        voteStatus: value,
      },
    });
  }
};

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

type LoadingStatus = "upvote-loading" | "downvote-loading" | "not-loading";

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<LoadingStatus>("not-loading");
  const [vote] = useVoteMutation();

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
          if (post.voteStatus === 1) {
            return;
          }

          setLoading("upvote-loading");

          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });

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
          if (post.voteStatus === -1) {
            return;
          }

          setLoading("downvote-loading");

          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });

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
