const User = require("../models/Users");
const Celebration = require("../models/Celebration");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

exports.getAllCelebrationsAdmin = async (req, res) => {
  try {
    const celebrations = await Celebration.find({}).populate('userId', 'name email');
    res.json(celebrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching celebrations", error: err });
  }
};

exports.deleteCelebrationAdmin = async (req, res) => {
  try {
    await Celebration.findByIdAndDelete(req.params.id);
    res.json({ message: "Celebration deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting celebration", error: err });
  }
};
