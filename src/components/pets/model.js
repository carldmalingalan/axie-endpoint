import { Schema, model } from "mongoose";

const PetSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: String,
    class: String,
    stage: Number,
    price: Object,
    deleted_at: {
      required: false,
      default: null,
      type: Date,
    },
  },
  {
    timestamps: {
      updatedAt: "updated_at",
      createdAt: "created_at",
    },
    versionKey: false,
  }
);

export default model("pets", PetSchema);
