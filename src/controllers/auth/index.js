const User = require("../../models/auth");
const Token = require("../../models/code");
const crypto = require("crypto-js");
const generateString = require("../../util/functions");
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");

function sendEmail(to, code) {
  return new Promise((resolve, reject) => {
    const transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: "lushverse01@gmail.com",
        pass: "pmxlegnmaeckztgi",
      },
    });

    const mail_option = {
      from: "Dash travel and tour",
      to: to,
      subject: "Email Verification Code",
      text: code,
    };

    transporter.sendMail(mail_option, (error, success) => {
      if (error) {
        return reject({ message: "An error occured" });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

exports.Signup = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({ message: "User already registered" });

    const hashedPassword = crypto.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_HASH_KEY,
      5
    ).toString();
    const userCredentials = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      image: req.body.image,
    };
    const newUser = new User(userCredentials);
    newUser.save((err, data) => {
      if (err) return res.status(400).json({ message: err });
      if (data) {
        const generatedCode = generateString(4);

        const newToken = new Token({ userId: data._id, token: generatedCode });
        newToken.save((error, success) => {
          if (error) {
            return res.status(400).json({ message: "Code not Handled" });
          }
          return sendEmail(req.body.email, generatedCode)
            .then((response) => {
              res.status(201).json({
                message: "Check your email for the verification code",
                userId: data._id,
                email: data.email,
              });
            })
            .catch((error) =>
              res.status(400).json({ message: "Something went wrong" })
            );
        });
      }
    });
  });
};

exports.verifyEmail = function (req, res, next) {
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token) {
      return res.status(400).json({
        message:
          "Your verification link may have expired. Please click on resend to get a valid verification code",
      });
    } else {
      User.findOne({ _id: token.userId }, function (err, user) {
        if (!user) {
          return res.status(401).json({
            message:
              "We were unable to find a user for this verification. Please SignUp!",
          });
        } else if (user.isVerified) {
          return res
            .status(200)
            .json({ message: "User has already been verified. Please Login" });
        } else {
          user.isVerified = true;
          user.save(function (err, data) {
            if (err) {
              return res.status(400).json({ message: "Something went wrong" });
            }
            if (data) {
              return res.status(200).json({
                message: "Your account has been successfully verified",
              });
            }
          });
        }
      });
    }
  });
};

exports.Signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ message: "Something went wrong" });
    if (!user) return res.status(400).json({ message: "User not found" });
    const decryptedPassword = crypto.AES.decrypt(
      user.password,
      process.env.CRYPTO_HASH_KEY
    ).toString(crypto.enc.Utf8);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    if (decryptedPassword === req.body.password) {
      if (user.isVerified) {
        res.status(201).json({ message: "Sign in successful", token, user });
      } else {
        res
          .status(400)
          .json({ message: "Your email has not been verified yet" });
      }
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  });
};

exports.getUsers = (req, res) => {
  User.find()
    .populate("messages")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Something went wrong" });
      }
      if (data) {
        return res.status(200).json(data);
      }
    });
};

exports.resendOTP = (req, res) => {
  User.findOne({ _id: req.body.id, isVerified: false }).exec((err, success) => {
    if (err) {
      res.status(400).json({ message: "User cannot be reverified" });
    }
    const generatedCode = generateString(4);

    const newToken = new Token({ userId: success._id, token: generatedCode });
    newToken.save((error, data) => {
      if (error) {
        return res.status(400).json({ message: "Code not Handled" });
      }
      return sendEmail(req.body.email, generatedCode)
        .then((response) => {
          res.status(201).json({
            message: "Your verification code has been resent successfully",
          });
        })
        .catch((error) =>
          res.status(400).json({ message: "Something went wrong" })
        );
    });
  });
};

exports.updatePassword = (req, res) => {
  const passwordMatch = req.body.confirmedPassword;
  const password = req.body.password;
  console.log(passwordMatch, password);

  if (password === passwordMatch) {
    User.findOneAndUpdate(
      { email: req.body.email },
      {
        password: crypto.AES.encrypt(
          req.body.password,
          process.env.CRYPTO_HASH_KEY,
          5
        ).toString(),
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(400).json({ message: "Something is actually wrong" });
        }
        if (!result) {
          return res.status(400).json({ message: "User not found" });
        }
        if (result) {
          res.status(200).json({ message: "Password updated successfully" });
        }
      }
    );
  } else {
    res.status(400).json({ message: "Password does not match" });
  }
};
