const Celebration = require("../models/Celebration");

exports.getCelebrations = async (req, res) => {
  try {
    const celebrations = await Celebration.find({});
    res.json(celebrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching celebrations", error: err });
  }
};

exports.getCelebrationById = async (req, res) => {
  try {
    const celebration = await Celebration.findById(req.params.id);
    if (!celebration) {
      return res.status(404).json({ message: "Celebration not found" });
    }
    res.json(celebration);
  } catch (err) {
    res.status(500).json({ message: "Error fetching celebration", error: err });
  }
};

exports.createCelebration = async (req, res) => {
  try {
    const celebrationData = {
      ...req.body,
      images: req.files?.images ? req.files.images.map(f => f.path) : [],
      audio: req.files?.audio ? req.files.audio[0].path : '',
      video: req.files?.video ? req.files.video[0].path : ''
    };
    
    const newCelebration = new Celebration(celebrationData);
    await newCelebration.save();
    res.status(201).json(newCelebration);
  } catch (err) {
    res.status(500).json({ message: "Error creating celebration", error: err });
  }
};

exports.updateCelebration = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Update images if new ones uploaded
    if (req.files?.images) {
      updateData.images = req.files.images.map(f => f.path);
    }

    // Update audio if new one uploaded
    if (req.files?.audio) {
      updateData.audio = req.files.audio[0].path;
    }

    // Update video if new one uploaded
    if (req.files?.video) {
      updateData.video = req.files.video[0].path;
    }

    const updated = await Celebration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating celebration", error: err });
  }
};

exports.deleteCelebration = async (req, res) => {
  try {
    await Celebration.findByIdAndDelete(req.params.id);
    res.json({ message: "Celebration deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting celebration", error: err });
  }
};
