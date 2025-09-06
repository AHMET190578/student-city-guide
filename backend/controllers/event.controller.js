import Event from "../models/event.model.js";

export const allActivities = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

export const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ message: "Error fetching event details", error });
  }
};

export const filterbyCity = async (req, res) => {
  try {
    const { city } = req.body;
    const event = await Event.find({ city }).sort({ startDate: 1 });
    if (!event || event.length === 0) {
      return res.status(404).json({ message: "No events found for this city" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error filtering events by city:", error);
    res.status(500).json({ message: "Error filtering events by city", error });
  }
};
