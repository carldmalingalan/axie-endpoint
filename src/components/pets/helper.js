import PetModel from "@components/pets/model";
import { parseParams, encodeId } from "@common/utils";

export const getPets = async (params) => {
  const { limit: $limit, offset: $skip, sort: $sort } = parseParams(params);

  const basePipeline = [
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

  const [petsObject] = petResult;
  const [{ total_count }] = petTotalCount;

  const petsWithHashedIds = petsObject.pet.map((pet) => ({
    ...pet,
    id: encodeId(pet.id),
  }));

  const obfuscatedPets = { ...petsObject, pet: petsWithHashedIds };

  return { ...obfuscatedPets, total_count };
};
