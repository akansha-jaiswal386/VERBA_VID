const express = require("express");
const { signup, updateUser, deleteUser, logout, login } = require("../Controllers/authController.js");
const { loginvalidation, signupvalidation } = require("../Middleware/Authentication.js");

// userRouter.js
const router = express.Router();

router.post('/signup', signupvalidation, signup);
router.put('/update/:id', signupvalidation, updateUser);
router.delete('/delete/:id', signupvalidation, deleteUser);
router.post("/login", loginvalidation, login);
router.post("/logout", logout);

module.exports = router;