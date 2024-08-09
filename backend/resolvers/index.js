import { mergeResolvers } from "@graphql-tools/merge";
import { userResolver } from "./user.resolver.js";
import { transactoinResolver } from "./transaction.resolver.js";


export const mergedResolver = mergeResolvers([userResolver, transactoinResolver])