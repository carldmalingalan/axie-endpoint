import { getPets, getPetInformation } from "@components/pets/helper";

const petsQuery = {
  pets: async (_, { input }) => {
    return await getPets(input);
  },
  getPet: async (_, { id }) => {
    return getPetInformation(id);
  },
};

export default petsQuery;
