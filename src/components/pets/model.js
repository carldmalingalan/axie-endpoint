import { Schema, model } from "mongoose";

const PetSchema = new Schema(
  {
    id: String,
    name: String,
    class: String,
    stage: Number,
    price: Object,
  },
  {
    timestamps: {
      updatedAt: "updated_at",
      createdAt: "created_at",
    },
  }
);

export default model("pets", PetSchema);
