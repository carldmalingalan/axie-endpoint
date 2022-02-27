import "core-js/stable";
import "regenerator-runtime/runtime";

import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import schema from "@src/schema";

import { MONGODB_URI, PORT } from "@common/constants";
import { graphqlHTTP } from "express-graphql";

const app = express();

mongoose.connect(MONGODB_URI, (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log("MongoDB Error: ", error);
  }
});

app.use("/graphql", graphqlHTTP({ graphiql: true, schema }));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log("Express is running in port 5000"));
