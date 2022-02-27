const axios = require("axios").default;
const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://localhost:27017/axie";
const THIRDPART_API = "https://graphql-gateway.axieinfinity.com/graphql";
const DOCUMENT_TOTAL_COUNT = 300;
const API_CALL_BATCH_COUNT = 50;

const client = new MongoClient(MONGODB_URI);

(async () => {
  try {
    await client.connect();
    const db = client.db();
    console.log("Prepering collection details...");
    const documents = [];

    console.log("Initializing axie API call...");
    for (
      let callIndex = 0;
      callIndex < DOCUMENT_TOTAL_COUNT;
      callIndex += API_CALL_BATCH_COUNT
    ) {
      console.log(`Fetching: ${callIndex}/${DOCUMENT_TOTAL_COUNT}`);
      const apiResponse = await axios({
        url: THIRDPART_API,
        method: "post",
        data: {
          query: `{
            axies(from: ${callIndex}, size: ${API_CALL_BATCH_COUNT}, auctionType: Sale, sort: PriceAsc){
                results{
                    id
                    name
                    stage
                    class
                    auction {
                        currentPriceUSD
                    }
                }
            }
        }`,
        },
      });
      const { data } = apiResponse;
      const { results } = data.data.axies;

      results.forEach((result) => {
        const { id, name, stage, class: axieClass, auction } = result;

        documents.push({
          id,
          name,
          stage,
          class: axieClass,
          price: { USD: auction.currentPriceUSD },
        });
      });
    }
    console.log("Documents: ", documents.length);
    await db.collection("pets").insertMany(documents);

    console.log("Successfully inserted data to mongodb");
  } catch (error) {
    console.log("ERROR: ", error);
  } finally {
    await client.close();
  }
})();
