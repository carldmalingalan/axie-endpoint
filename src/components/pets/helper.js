import PetModel from "@components/pets/model";
import { parseParams, encodeId, decodeId, getUuid } from "@common/utils";

export const getPets = async (params) => {
  const { limit: $limit, offset: $skip, sort: $sort } = parseParams(params);

  const basePipeline = [
    { $match: { deleted_at: null } },
    { $addFields: { priceUSD: "$price.USD" } },
    { $project: { _id: 0, price: 0 } },
  ];

  const [petResult, petTotalCount] = await Promise.all([
    PetModel.aggregate([
      ...basePipeline,
      { $sort },
      { $skip },
      { $limit },
      { $group: { _id: null, pet: { $push: "$$ROOT" } } },
      { $project: { _id: 0, pet: 1, result_count: { $size: "$pet" } } },
    ]),
    PetModel.aggregate([...basePipeline, { $count: "total_count" }]),
  ]);

  if (!petResult.length || !petTotalCount.length) {
    throw new Error("Pet cannot be fetched.");
  }

  const [petsObject] = petResult;
  const [{ total_count: totalCount }] = petTotalCount;

  const petsWithHashedIds = petsObject.pet.map((pet) => ({
    ...pet,
    id: encodeId(pet.id),
  }));

  const obfuscatedPets = { ...petsObject, pet: petsWithHashedIds };

  return { ...obfuscatedPets, total_count: totalCount };
};

export const createNewPet = async (params) => {
  const mutableParams = params;
  const { priceUSD } = mutableParams;

  delete mutableParams.priceUSD;

  const petDetals = {
    ...mutableParams,
    id: getUuid(),
    price: { USD: priceUSD },
  };
  const newPet = await PetModel.create(petDetals);

  if (!newPet) {
    throw new Error("Something went wrong cannot create new pet.");
  }

  const { id, name, class: petClass, stage, price } = newPet;
  const hashedId = encodeId(id);

  return { id: hashedId, name, class: petClass, stage, priceUSD: price.USD };
};

export const updatePetDetails = async (params) => {
  const mutableParams = params;
  const { id, priceUSD } = mutableParams;
  const rawId = decodeId(id);

  delete mutableParams.id;
  delete mutableParams.priceUSD;

  let updateDetails = mutableParams;

  if (priceUSD) {
    updateDetails = { ...updateDetails, price: { USD: priceUSD } };
  }

  const updateResult = await PetModel.findOneAndUpdate(
    { id: rawId, deleted_at: null },
    { $set: { ...updateDetails } },
    { new: true }
  );

  if (!updateResult) {
    throw new Error("Pet cannot be found.");
  }

  const { name, class: petClass, stage, price } = updateResult;

  return { id, name, class: petClass, stage, priceUSD: price.USD };
};

export const removePet = async (id) => {
  const rawId = decodeId(id);

  const deleteResult = await PetModel.findOneAndUpdate(
    { id: rawId, deleted_at: null },
    { $currentDate: { deleted_at: true } },
    { new: true }
  );

  if (!deleteResult) {
    throw new Error("Pet cannot be found.");
  }

  const { name, class: petClass, stage, price } = deleteResult;

  return { id, name, class: petClass, stage, priceUSD: price.USD };
};
