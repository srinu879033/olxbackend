const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOTP = require("../utils/otpGeneration");
const userDetails = require("../models/userDetails");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.signUp = catchAsync(async (request, response, next) => {
  const { username, password, name, mailId } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let result = await userDetails.find({ username: username });
  if (result.length === 0) {
    const createUser = await userDetails.create({
      _id: mongoose.Types.ObjectId(),
      username: username,
      password: hashedPassword,
      name: name,
      mailId: mailId,
    });
    response.send({ msg: "User Created Successfully" });
    let toMail = mailId;
    let text = `You have successfully registered with the username: ${username} in FashionFit Organization`;
    let subject = "Successful Registration";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.fromMail,
        pass: process.env.fromMailPassword,
      },
    });
    let mailOptions = {
      from: process.env.fromMail,
      to: toMail,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error, "creation failed");
      }
    });
  } else {
    response.send({ msg: "User Already Exists" });
  }
});

exports.login = catchAsync(async (request, response, next) => {
  const { mailId, password } = request.body;

  let result1 = await userDetails.find({ mailId: mailId });
  if (result1.length === 0) {
    response.status(400);
    response.send({ msg: "Invalid User" });
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      result1[0].password
    );
    if (isPasswordMatched == true) {
      const payload = {
        mailId: mailId,
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      response.send({ jwt_token: jwtToken, msg: "Login Successful" });
    } else {
      response.status(400);
      response.send({ msg: "Invalid Password" });
    }
  }
});

exports.otp = catchAsync(async (request, response) => {
  const { mailId } = request.body;
  let toMail = mailId;
  let random = parseInt(generateOTP());
  let text = `${random} is your FashionFit verification OTP.Please do not share with anyone`;
  let subject = "FashionFit Verification";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.fromMail,
      pass: process.env.fromMailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let mailOptions = {
    from: process.env.fromMail,
    to: toMail,
    subject: subject,
    text: text,
  };
  await transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  });
  response.status(200);
  response.send({ otp: random, msg: `Otp sent to mail` });
});
