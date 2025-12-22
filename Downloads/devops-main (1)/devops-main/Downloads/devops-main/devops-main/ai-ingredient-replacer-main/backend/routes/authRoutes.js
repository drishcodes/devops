const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

router.get("/me", auth, me);

module.exports = router;
