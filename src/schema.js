import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { makeExecutableSchema } from "@graphql-tools/schema";

import petQueries from "@components/pets/query";
import classQueries from "@components/classes/query";

const typeDefs = loadSchemaSync("./**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = { Axie: { ...petQueries, ...classQueries } };

export default makeExecutableSchema({ typeDefs, resolvers });
