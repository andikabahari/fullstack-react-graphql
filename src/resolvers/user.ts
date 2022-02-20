import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class CredentialsInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: CredentialsInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = input;

    if (username.length < 4) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be at least 4 characters.",
          },
        ],
      };
    }

    if (password.length < 4) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be at least 4 characters.",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username is already taken.",
            },
          ],
        };
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: CredentialsInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = input;

    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "Username doesn't exist." }],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Password is incorrect." }],
      };
    }

    return { user };
  }
}
