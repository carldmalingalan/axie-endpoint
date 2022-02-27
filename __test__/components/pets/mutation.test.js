import * as petHelper from "@components/pets/helper";
import petMutation from "@components/pets/mutation";

jest.mock("@components/pets/helper", () => ({
  createNewPet: jest.fn(),
  updatePetDetails: jest.fn(),
  removePet: jest.fn(),
}));

describe("petMutation", () => {
  describe("createPet", () => {
    const validResponse = {
      id: "001",
      name: "Test #1",
      stage: 1,
      class: "Aquatic",
      priceUSD: "10.25",
    };
    it("should return a valid response", async () => {
      petHelper.createNewPet.mockImplementation(() =>
        Promise.resolve(validResponse)
      );

      await expect(
        petMutation.createPet(null, { input: validResponse })
      ).resolves.toEqual(validResponse);
    });

    it("should throw an error", async () => {
      petHelper.createNewPet.mockImplementation(() =>
        Promise.reject(new Error())
      );

      await expect(
        petMutation.createPet(null, { input: validResponse })
      ).rejects.toThrow(new Error());
    });
  });
  describe("updatePet", () => {
    const validResponse = {
      id: "001",
      name: "Test #1",
      stage: 1,
      class: "Aquatic",
      priceUSD: "10.25",
    };
    it("should return a valid response", async () => {
      petHelper.updatePetDetails.mockImplementation(() =>
        Promise.resolve(validResponse)
      );

      await expect(
        petMutation.updatePet(null, { input: validResponse })
      ).resolves.toEqual(validResponse);
    });

    it("should throw an error", async () => {
      petHelper.updatePetDetails.mockImplementation(() =>
        Promise.reject(new Error())
      );

      await expect(
        petMutation.updatePet(null, { input: validResponse })
      ).rejects.toThrow(new Error());
    });
  });

  describe("deletePet", () => {
    const validResponse = {
      id: "001",
      name: "Test #1",
      stage: 1,
      class: "Aquatic",
      priceUSD: "10.25",
    };
    it("should return a valid response", async () => {
      petHelper.removePet.mockImplementation(() =>
        Promise.resolve(validResponse)
      );

      await expect(
        petMutation.deletePet(null, { id: validResponse.id })
      ).resolves.toEqual(validResponse);
    });

    it("should throw an error", async () => {
      petHelper.removePet.mockImplementation(() => Promise.reject(new Error()));

      await expect(
        petMutation.deletePet(null, { id: validResponse.id })
      ).rejects.toThrow(new Error());
    });
  });
});
