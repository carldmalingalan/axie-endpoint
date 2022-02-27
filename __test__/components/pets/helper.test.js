import PetModel from "@components/pets/model";
import * as petHelper from "@components/pets/helper";

jest.mock("@components/pets/model", () => ({
  aggregate: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
}));

describe("getPets", () => {
  const validPetResult = [
    {
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
      result_size: 2,
    },
  ];
  const valuePetTotalCount = [{ total_count: 10 }];
  it("should return a valid response", async () => {
    const expectedObject = {
      id: expect.any(String),
      name: expect.any(String),
      class: expect.any(String),
      stage: expect.any(Number),
      priceUSD: expect.any(String),
    };

    PetModel.aggregate
      .mockImplementationOnce(() => Promise.resolve(validPetResult))
      .mockImplementationOnce(() => Promise.resolve(valuePetTotalCount));

    await expect(petHelper.getPets({ limit: 51 })).resolves.toEqual({
      pet: expect.arrayContaining([expectedObject]),
      total_count: expect.any(Number),
      result_size: expect.any(Number),
    });
  });

  it("should throw a error pet cannot be fetched", async () => {
    PetModel.aggregate
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([]));

    await expect(petHelper.getPets()).rejects.toThrow(
      new Error("Pet cannot be fetched.")
    );
  });
});

describe("createNewPet", () => {
  const validResponse = {
    id: expect.any(String),
    name: expect.any(String),
    class: expect.any(String),
    stage: expect.any(Number),
    priceUSD: expect.any(String),
  };

  const paramsInput = {
    name: "Test",
    class: "Aquatic",
    stage: 1,
    priceUSD: "10.23",
  };
  it("should create a new pet", async () => {
    PetModel.create.mockImplementation(() =>
      Promise.resolve({
        id: "0001",
        name: paramsInput.name,
        class: paramsInput.class,
        stage: paramsInput.stage,
        price: { USD: paramsInput.priceUSD },
      })
    );
    await expect(petHelper.createNewPet({ ...paramsInput })).resolves.toEqual(
      validResponse
    );
  });

  it("should throw a error something went wrong creating pet", async () => {
    PetModel.create.mockImplementation(() => Promise.resolve(null));

    await expect(petHelper.createNewPet(paramsInput)).rejects.toThrow(
      new Error("Something went wrong cannot create new pet.")
    );
  });
});

describe("updatePetDetails", () => {
  it("should return a valid updated pet", async () => {
    const prevPetState = {
      id: "001",
      name: "Test #1",
      class: "Aquatic",
      stage: 1,
      priceUSD: "10",
    };

    const currPetState = {
      ...prevPetState,
      name: "Test #2",
      priceUSD: "20",
    };

    PetModel.findOneAndUpdate.mockImplementationOnce(() =>
      Promise.resolve({
        ...currPetState,
        price: { USD: currPetState.priceUSD },
      })
    );

    await expect(
      petHelper.updatePetDetails({ id: "001", name: "Test #2", priceUSD: "20" })
    ).resolves.toEqual(currPetState);
  });

  it("should return a valid updated pet (not price)", async () => {
    const prevPetState = {
      id: "001",
      name: "Test #1",
      class: "Aquatic",
      stage: 1,
      priceUSD: "10",
    };

    const currPetState = {
      ...prevPetState,
      name: "Test #2",
    };

    PetModel.findOneAndUpdate.mockImplementationOnce(() =>
      Promise.resolve({
        ...currPetState,
        price: { USD: currPetState.priceUSD },
      })
    );

    await expect(
      petHelper.updatePetDetails({ id: "001", name: "Test #2" })
    ).resolves.toEqual(currPetState);
  });

  it("should throw an error pet cannot be found.", async () => {
    PetModel.findOneAndUpdate.mockImplementationOnce(() =>
      Promise.resolve(null)
    );

    await expect(
      petHelper.updatePetDetails({ id: "001", name: "Test #2", priceUSD: "20" })
    ).rejects.toThrow(new Error("Pet cannot be found."));
  });
});

describe("removePet", () => {
  it("should return previous pet details", async () => {
    const prevPetState = {
      id: "001",
      name: "Test #1",
      class: "Aquatic",
      stage: 1,
      priceUSD: "10",
    };

    PetModel.findOneAndUpdate.mockImplementationOnce(() =>
      Promise.resolve({
        ...prevPetState,
        price: { USD: prevPetState.priceUSD },
      })
    );

    await expect(petHelper.removePet("001")).resolves.toEqual(prevPetState);
  });

  it("should throw a pet cannot be found error", async () => {
    PetModel.findOneAndUpdate.mockImplementationOnce(() =>
      Promise.resolve(null)
    );

    await expect(petHelper.removePet("001")).rejects.toThrow(
      new Error("Pet cannot be found.")
    );
  });
});

describe("getPetInformation", () => {
  const validResponse = {
    id: "001",
    name: "Test #1",
    class: "Aquatic",
    stage: 1,
    priceUSD: "10",
  };
  it("should return a valid response", async () => {
    PetModel.findOne.mockImplementation(() => ({
      lean: () =>
        Promise.resolve({
          ...validResponse,
          price: { USD: validResponse.priceUSD },
        }),
    }));

    await expect(petHelper.getPetInformation("001")).resolves.toEqual(
      validResponse
    );
  });

  it("should return a valid response", async () => {
    PetModel.findOne.mockImplementation(() => ({
      lean: () => Promise.resolve(null),
    }));

    await expect(petHelper.getPetInformation("001")).rejects.toThrow(
      new Error("Pet cannot be found.")
    );
  });
});
