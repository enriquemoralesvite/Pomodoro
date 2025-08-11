const User = require("../models/User");
const { comparePassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { validatePassword, validateEmail } = require("../utils/validations");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({
        message:
          "Password must be at least 6 characters, contain an uppercase letter, a lowercase letter, a number, and a special character",
      });
  }
  try {
    const newUser = await User.create({ username, email, password });

    const tokenPayload = { id: newUser.id, email: newUser.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.message.includes("ya está registrado")) {
      return res.status(409).json({ message: "already registered" });
    }
    console.error("Registration error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Renews an access token using a valid refresh token.
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token." });
  }

  const tokenPayload = { id: decoded.id, email: decoded.email };
  const newAccessToken = generateAccessToken(tokenPayload);

  res.status(200).json({ accessToken: newAccessToken });
};

module.exports = { register, login, refreshToken };
