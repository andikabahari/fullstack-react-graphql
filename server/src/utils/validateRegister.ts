import { CredentialsInput } from "src/resolvers/CredentialsInput";

export const validateRegister = ({
  username,
  email,
  password,
}: CredentialsInput) => {
  if (username.length < 4) {
    return [
      {
        field: "username",
        message: "Username must be at least 4 characters.",
      },
    ];
  }

  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "Email must be in a valid format.",
      },
    ];
  }

  if (password.length < 4) {
    return [
      {
        field: "password",
        message: "Password must be at least 4 characters.",
      },
    ];
  }

  return null;
};
