import PetModel from "@components/pets/model";
import * as classHelper from "@components/classes/helper";

jest.mock("@components/pets/model", () => ({
  aggregate: jest.fn(),
}));

describe("getClasses", () => {
  const validResponse = [
    { name: "Aquatic", total_pet_count: 10 },
    { name: "Beast", total_pet_count: 12 },
  ];
  it("should return a valid response", async () => {
    PetModel.aggregate.mockImplementation(() => Promise.resolve(validResponse));

    await expect(classHelper.getClasses()).resolves.toEqual(validResponse);
  });

  it("should throw a error class cannot be found", async () => {
    PetModel.aggregate.mockImplementation(() => Promise.resolve(null));

    await expect(classHelper.getClasses()).rejects.toThrow(
      new Error("Class cannot be found.")
    );
  });
});
