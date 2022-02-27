import * as classHelper from "@components/classes/helper";
import classQueries from "@components/classes/query";

jest.mock("@components/classes/helper", () => ({
  getClasses: jest.fn(),
}));

describe("classQueries", () => {
  describe("classes()", () => {
    const validResponse = [
      { name: "Aquatic", total_pet_count: 10 },
      { name: "Beast", total_pet_count: 12 },
    ];
    it("should return a valid response", async () => {
      classHelper.getClasses.mockImplementation(() =>
        Promise.resolve(validResponse)
      );

      await expect(classQueries.classes()).resolves.toEqual(validResponse);
    });

    it("should return a empty array", async () => {
      classHelper.getClasses.mockImplementation(() => Promise.resolve([]));
      await expect(classQueries.classes()).resolves.toEqual([]);
    });

    it("should throw a error class cannot be found", async () => {
      classHelper.getClasses.mockImplementation(() =>
        Promise.reject(new Error("Class cannot be found."))
      );
      await expect(classQueries.classes()).rejects.toThrow(
        new Error("Class cannot be found.")
      );
    });
  });
});
