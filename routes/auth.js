const router = require("express").Router();
const User = require("../model/User");
const {
  registerValidation,
  loginValidation,
} = require("../Validation");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// *************************** Register **************************************
router.post("/register", async (req, res) => {

  // Validate data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error);

  // Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email is already exist");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// *************************** Login **************************************

router.post("/login", async (req, res) => {

  // Validate data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error);

  // Checking if the email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesn't exist");

  // Checking if password correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send("Invalid Password");

  // Create and assign a token 
  const token = jwt.sign({_id: user._id}, process.env.Token_Secret);
  res.header('auth-token', token).send(token);

  res.send('Logged in !!!');

});

module.exports = router;
