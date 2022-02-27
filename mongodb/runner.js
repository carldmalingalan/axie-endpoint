const axios = require("axios").default;
const { MongoClient } = require("mongodb");

const MONGODB_URI = "";
const THIRDPART_API = "https://graphql-gateway.axieinfinity.com/graphql";
const DOCUMENT_TOTAL_COUNT = 300;
const API_CALL_BATCH_COUNT = 50;

const client = new MongoClient(MONGODB_URI);

(async () => {
  try {
    await client.connect();
    const db = client.db();
    console.log("Prepering collection details...");
    const COLLECTION_DETAILS = {
      Aquatic: { name: "aquatic_class", documents: [] },
      Beast: { name: "beast_class", documents: [] },
      Bird: { name: "bird_class", documents: [] },
      Bug: { name: "bug_class", documents: [] },
      Plant: { name: "plant_class", documents: [] },
      Reptile: { name: "reptile_class", documents: [] },
    };

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

        if (COLLECTION_DETAILS[axieClass]) {
          COLLECTION_DETAILS[axieClass].documents.push({
            id,
            name,
            stage,
            class: axieClass,
            price: {
              USD: auction.currentPriceUSD,
            },
          });
        }
      });
    }

    const databaseCollection = Object.entries(COLLECTION_DETAILS);

    console.log(
      "Initializing transaction session for saving data to database..."
    );
    const session = client.startSession();

    // Transactions only run in a replica set
    await session.withTransaction(async () => {
      try {
        for (
          let collectionIndex = 0;
          collectionIndex < databaseCollection.length;
          collectionIndex++
        ) {
          const [axieClass, collectionInfo] =
            databaseCollection[collectionIndex];
          const { name, documents } = collectionInfo;
          console.log(`[${axieClass}]: Total document: ${documents.length}`);

          await db.collection(name).insertMany(documents, { session });
          console.log(
            `[${axieClass}]: Successfully inserted documents to database`
          );
        }
      } catch (error) {
        console.log("Transaction Error: ", error);
        throw error;
      }
    });

    console.log("Closing transaction session...");
    await session.endSession();
    console.log("Successfully inserted data to mongodb");
  } catch (error) {
    console.log("ERROR: ", error);
  } finally {
    await client.close();
  }
})();
