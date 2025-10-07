const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الأماكن" });
  }
};

