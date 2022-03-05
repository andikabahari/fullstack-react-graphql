import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.upvotes)
  post: Post;

  @Field()
  @Column({ type: "int" })
  value: number;
}
