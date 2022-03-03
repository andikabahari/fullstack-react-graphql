import { dedupExchange, Exchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  LogoutMutation,
  RegisterMutation,
} from "../generated/graphql";
import { myUpdateQuery } from "./myUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("Not authenticated"))
          Router.replace("/login");
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:5000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result: LoginMutation, args, cache, info) => {
            myUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) =>
                result.login.errors ? query : { me: result.login.user }
            );
          },
          logout: (_result: LogoutMutation, args, cache, info) => {
            myUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          register: (_result: RegisterMutation, args, cache, info) => {
            myUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) =>
                result.register.errors ? query : { me: result.register.user }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
