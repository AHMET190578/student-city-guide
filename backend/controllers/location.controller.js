import City from "../models/sehir.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import e from "express";

export const allLocation = async (req, res) => {
  try {
    const locations = await City.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const onecity = async (req, res) => {
  try {
    const { cityName, category, universityName } = req.query;
    let filter = {};

    if (cityName) {
      filter.cityName = { $regex: new RegExp(`^${cityName}$`, "i") };
    }
    if (category) {
      // Eğer City modelinde kategori dizisi ise:
      filter.categories = { $in: [category] };
    }
    if (universityName) {
      filter.universityName = {
        $regex: new RegExp(`^${universityName}$`, "i"),
      };
    }

    const cities = await City.find(filter);
    res.json(cities);
  } catch (error) {
    console.error("Error filtering cities:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const info = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid city ID format" });
    }

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const comments = await Comment.find({ placeId: id })
      .select("name text rating")
      .sort({
        createdAt: -1,
      });

    res.json({ city, comments });
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "City ID is required" });
    }
    const { name, text, rating } = req.body;
    if (!name || !text || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    const comment = new Comment({
      name,
      text,
      placeId: id,
      rating,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const locations = await City.find({
      categories: { $in: [category] },
    });

    if (locations.length === 0) {
      return res
        .status(404)
        .json({ message: "No locations found for this category" });
    }

    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopRatedPlaces = async (req, res) => {
  try {
    const results = await Comment.aggregate([
      {
        $group: {
          _id: "$placeId",
          averageRating: { $avg: "$rating" },
          totalComments: { $sum: 1 },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "cities",
          localField: "_id",
          foreignField: "_id",
          as: "cityDetails",
        },
      },
      {
        $match: {
          "cityDetails.0": { $exists: true }, // cityDetails'in boş olmadığından emin ol
        },
      },
      {
        $unwind: "$cityDetails",
      },
      {
        $project: {
          _id: 0,
          placeId: "$_id",
          averageRating: { $round: ["$averageRating", 1] },
          totalComments: 1,
          placeName: "$cityDetails.placeName",
          cityName: "$cityDetails.cityName",
          universityName: "$cityDetails.universityName",
          description: "$cityDetails.description",
          location: "$cityDetails.location",
          images: "$cityDetails.images",
          categories: "$cityDetails.categories",
        },
      },
    ]);

    // Debug için log ekleyelim
    console.log("Aggregation results:", results);

    res.json(results);
  } catch (error) {
    console.error("getTopRatedPlaces error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
