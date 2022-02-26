import {
  createNewPet,
  updatePetDetails,
  removePet,
} from "@components/pets/helper";

const petMutation = {
  createPet: async (_, { input }) => {
    return createNewPet(input);
  },
  updatePet: async (_, { input }) => {
    return updatePetDetails(input);
  },
  deletePet: async (_, { id }) => {
    return removePet(id);
  },
};

export default petMutation;
