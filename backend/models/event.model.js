import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    location: String, // Mekanın adresi veya açıklaması
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    images: [String], // İstersen etkinlik fotoğrafları ekleyebilirsin
    category: String, // Konser, festival, fuar gibi
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
