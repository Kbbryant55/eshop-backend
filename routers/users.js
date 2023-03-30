const { User } = require("../models/user");
const express = require("express");
const { route } = require("./products");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const UserList = await User.find().select("-passwordHash");

  if (!UserList) {
    res.status(500).json({ success: false });
  }

  res.status(200).send(UserList);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }

  res.status(200).send(user);
});

router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 12),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    streetAddress: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(404).send("The user cannot be created");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("The user is not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("Password is incorrect");
  }
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      image: req.body.image,
      color: req.body.color,
    },
    { new: true }
  );

  if (!user) return res.status(404).send("The user cannot be updated");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) res.status(500).json({ success: false });

  res.send({ userCount: userCount });
});

router.delete("/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
});

module.exports = router;
