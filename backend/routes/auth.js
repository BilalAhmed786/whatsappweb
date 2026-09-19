const express = require("express");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userAuthorize = require("../middleware/middleware");
const sendEmail = require("../utils/sendEmail");
const resetPasswordTemplate = require("../utils/resetPasswordTemplate");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {
    formData: { name, email, password, retypepassword },
  } = req.body;

  const validation = [];

  if (!name || !email || !password || !retypepassword)
    validation.push("All fields required");

  if (password !== retypepassword) {
    validation.push("passwords are Mismatch");
  }
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      validation.push("Already register with this email");
    }

    if (validation.length > 0) {
      return res.status(400).json(validation);
    }

    const createuser = new User({ name, email, password, retypepassword });

    const usersave = await createuser.save();

    const userdet = await User.findOne(
      { _id: usersave._id },
      { password: 0, retypepassword: 0 },
    );

    const token = jwt.sign({ id: usersave._id }, process.env.SK, {
      expiresIn: "1h",
    });

    // Store the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // MUST be true when sameSite is 'none'
      sameSite: "none", // Allows cross-site cookie sharing over HTTPS
      maxAge: 3600000, // 1 hour
    });

    return res.json({ msg: "user registerd succesfully", user: userdet });
  } catch (error) {
    if (err.code === 11000) {
      return res.status(400).json(["Email already registered"]);
    }
  }
});

router.post("/login", async (req, res) => {
  const {
    formData: { email, password },
  } = req.body;

  if (!email || !password) {
    return res.status(401).json("All field required");
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json("Invalid email or password");
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(401).json("invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.SK, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // MUST be true when sameSite is 'none'
      sameSite: "none", // Allows cross-site cookie sharing over HTTPS
      maxAge: 3600000, // 1 hour
    });

    return res.json("login successfully");
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json("Logged out successfully");
});

// POST /forgot-password
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        msg: "If that email exists, a reset link has been sent.",
      });
    }

    const secret = process.env.SK + user.password;
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "5m" });

    const resetUrl = `${process.env.FRONTEND_BASE_URL}/resetpassword/${user._id}/${token}`;

  const htmlContent = resetPasswordTemplate(resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: htmlContent,
    });

    return res.json({
      msg: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json(["Error sending reset email"]);
  }
});

router.post("/resetpassword/:id/:token", async (req, res) => {
  const { password, retypepassword } = req.body;
  const { id, token } = req.params;

  const validation = [];

  if (!password || !retypepassword) {
    validation.push("All fields are required");
  }

  if (password !== retypepassword) {
    validation.push("Passwords do not match");
  }

  if (validation.length > 0) {
    return res.status(400).json(validation);
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json(["Invalid or expired reset token"]);
    }

    // Verify token using secret derived from current user password
    const secret = process.env.SK + user.password;
    jwt.verify(token, secret);

    // Set new password (ensure pre-save hook handles hashing if using bcrypt)
    user.password = password;
    user.retypepassword = retypepassword; // Only if your schema requires it

    await user.save();

    return res.json({ msg: "Password reset successful. You can now log in." });
  } catch (error) {
    // If token is expired, tampered with, or used after password was already changed
    return res.status(400).json(["Invalid or expired reset token"]);
  }
});

router.get("/userinfo", userAuthorize, async (req, res) => {
  try {
    const userinfo = await User.findOne(
      { _id: req.userId },
      { password: 0, retypepassword: 0 },
    );

    return res.json(userinfo);
  } catch (error) {
    if (error) {
      return res.status(401).json("invalid user");
    }
  }
});

module.exports = router;
