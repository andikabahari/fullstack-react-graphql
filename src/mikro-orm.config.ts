import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
console.log("dirname", __dirname);

export default {
  entities: [Post, User],
  dbName: "fullstack_react_graphql",
  password: "root",
  type: "postgresql",
  debug: !__prod__,
  allowGlobalContext: true,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
} as Parameters<typeof MikroORM.init>[0];
