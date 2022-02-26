import "core-js/stable";
import "regenerator-runtime/runtime";

import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import schema from "@src/schema";

import { MONGODB_URI } from "@common/constants";
import { graphqlHTTP } from "express-graphql";

const app = express();

mongoose.connect(MONGODB_URI, (error) => {
  if (error) {
    console.log("MongoDB Error: ", error);
  }
});

app.use("/graphql", graphqlHTTP({ graphiql: true, schema }));

app.listen(5000, () => console.log("Express is running in port 5000"));
