import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";
import { withApolloClient } from "../../utils/withApolloClient";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
              cache.evict({ fieldName: "posts" });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          }

          if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              type="password"
            />
            {tokenError ? (
              <Box>
                <Box style={{ color: "red" }}>{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Forgot your password?</Link>
                </NextLink>
              </Box>
            ) : null}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApolloClient({ ssr: false })(ChangePassword);
