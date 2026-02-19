const Celebration = require("../models/Celebration");

exports.getCelebrations = async (req, res) => {
  try {
    const celebrations = await Celebration.find({});
    res.json(celebrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching celebrations", error: err });
  }
};

exports.createCelebration = async (req, res) => {
  try {
    const newCelebration = new Celebration(req.body);
    await newCelebration.save();
    res.status(201).json(newCelebration);
  } catch (err) {
    res.status(500).json({ message: "Error creating celebration", error: err });
  }
};
