import { getPets } from "@components/pets/helper";

const petsQuery = {
  pets: async (_, { input }) => {
    return await getPets(input);
  },
};

export default petsQuery;
