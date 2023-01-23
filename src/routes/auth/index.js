const {
  Signup,
  verifyEmail,
  Signin,
  getUsers,
  resendOTP,
  updatePassword,
} = require("../../controllers/auth");

const router = require("express").Router();

router.post("/signup", Signup);
router.post("/verify", verifyEmail);
router.post("/signin", Signin);
router.get("/allusers", getUsers);
router.post("/resendotp", resendOTP);
router.put("/updatePassword", updatePassword);

module.exports = router;
