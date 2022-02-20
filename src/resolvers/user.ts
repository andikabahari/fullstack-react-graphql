import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class CredentialsInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("input") input: CredentialsInput,
    @Ctx() { em }: MyContext
  ) {
    const { username, password } = input;
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await em.persistAndFlush(user);
    return user;
  }
}
