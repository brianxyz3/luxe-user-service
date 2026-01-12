const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const catchAsync = require("./utlis/catchAsync.js");
const hashSaltRounds = 10;

const User = require("./models/user.js");
const ExpressError = require("./utlis/ExpressError.js");
const generateToken = require("./utlis/generateToken.js");

const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://brianchima22_db_user:XoxkZm581v05zbha@cluster0.klnhjhj.mongodb.net/?appName=Cluster0";

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/api/users/admin",
  catchAsync(async (req, res) => {
    const usersData = await User.find();
    const users = usersData.map((user) => {
      return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        deliveryAddress: user.deliveryAddress,
        userRole: user.userRole,
      };
    });
    res.status(200).json(users);
  })
);

app.post(
  "/api/users/login",
  catchAsync(async (req, res) => {
    try {
      const { email, password, guestId } = req.body;
      const userArr = await User.find({ email });

      const user = userArr[0];

      const isPassword = await bcrypt
        .compare(password, user.password)
        .catch((err) => console.log("Bcrypt error occurred: " + err));

      if (isPassword) {
        const token = generateToken(user._id, email, user.userRole);

        const data = {
          userDetail: {
            token,
          },
          cart: user.cart,
          message: "User Logged In Successfully",
        };

        res.status(200).json(data);
      } else {
        res.status(401).json({ message: "Incorrect email/Password" });
      }
    } catch (error) {
      throw new ExpressError(`Internal Server Error: ${error}`, 500);
    }
  })
);

app.post(
  "/api/users/register",
  catchAsync(async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, hashSaltRounds);
      const newUser = new User({
        firstName,
        lastName,
        email,
        userRole: "customer",
        password: hashedPassword,
      });

      const savedUser = await newUser.save().catch((err) => console.log(err));

      const token = generateToken(
        savedUser._id,
        savedUser.email,
        savedUser.userRole
      );

      const data = {
        userDetail: {
          token,
        },
        message: "User Registered Successfully",
      };
      res.status(201).json(data);
    } catch (err) {
      console.log(`Error occurred in registring new user: ${err}`);
      return;
    }
  })
);

app.get("/api/users/signOut", (req, res) => {
  // const token = req.body;
  // expire token
  res.status(200).json({ message: "GoodBye, Come Back Soon." });
});

app.get("/health", async (req, res) => {
  console.log("Healthy");
  res.status(200).json();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong. Try Again" } = err;
  res.status(statusCode).json(`${statusCode} ${message}`);
});

app.listen(PORT, "0.0.0.0");
