import PetModel from "@components/pets/model";

export const getClasses = async () => {
  const classResult = await PetModel.aggregate([
    { $group: { _id: "$class", total_pet_count: { $sum: 1 } } },
    { $project: { _id: 0, name: "$_id", total_pet_count: 1 } },
  ]);

  return classResult;
};
