import * as petHelper from "@components/pets/helper";
import petQueries from "@components/pets/query";

jest.mock("@components/pets/helper", () => ({
  getPets: jest.fn(),
}));

describe("petsQuery", () => {
  describe("pets", () => {
    const validResponse = {
      total_count: 10,
      result_count: 2,
      pet: [
        {
          id: "001",
          name: "Test Pet #1",
          stage: 1,
          class: "Beast",
          priceUSD: "12.10",
        },
        {
          id: "002",
          name: "Test Pet #2",
          stage: 1,
          class: "Aquatic",
          priceUSD: "15.20",
        },
      ],
    };
    it("should return a valid response", async () => {
      petHelper.getPets.mockImplementation(() =>
        Promise.resolve(validResponse)
      );

      await expect(
        petQueries.pets(null, { input: { limit: 51 } })
      ).resolves.toEqual(validResponse);
    });

    it("should throw an error", async () => {
      petHelper.getPets.mockImplementation(() => Promise.reject(new Error()));

      await expect(
        petQueries.pets(null, { input: { limit: 49 } })
      ).rejects.toThrow(new Error());
    });
  });
});
