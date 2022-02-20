import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedist from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";

declare module "express-session" {
  export interface Session {
    userId: number;
  }
}

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();
  const port = 5000;

  app.set("trust proxy", true);

  const RedisStore = connectRedist(session);
  const redisClient = new Redis();

  const oneDay = 1000 * 60 * 60 * 24;
  const maxAge = 30 * oneDay;
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // secure: __prod__, // https
        // sameSite: "lax", // csrf
      },
      saveUninitialized: false,
      secret: "keyboard cat",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "https://studio.apollographql.com",
      credentials: true,
    },
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

main().catch((err) => console.log(err));
