import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../../utils/createUrqlClient";

const EditPost: React.FC<{}> = ({}) => {
  return <>Hello</>;
};

export default withUrqlClient(createUrqlClient)(EditPost);
