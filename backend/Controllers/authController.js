const bcrypt = require("bcrypt");
const UserModel = require("../Models/user.js");
const jwt = require("jsonwebtoken");

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists. Please login or use a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful. You can now login." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong during signup. Please try again later." });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Error updating user. Please try again." });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Error deleting user. Please try again." });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong during login. Please try again later." });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Error during logout. Please try again." });
  }
};

module.exports = { signup, updateUser, deleteUser, login, logout };
