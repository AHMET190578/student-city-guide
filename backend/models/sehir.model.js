import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
    universityName: {
      type: String,
      required: true,
    },
    placeName: {
      type: String,
      required: true,
    },
    description: String,
    location: String,
    images: [String],
    categories: [String],
  },

  { timestamps: true }
);
const City = mongoose.model("City", citySchema);
export default City;
