const {
  postAddReserve,
  getFetchReserves,
  getFetcheReserve,
  deleteReserve,
} = require("../../controllers/reserves");
const { uploadS3 } = require("../../middlewares");

const router = require("express").Router();

router.post(
  "/create_reserves",
  uploadS3.fields([
    { name: "ownerImage", maxCount: 1 },
    { name: "locationImage", maxCount: 1 },
    { name: "album", maxCount: 5 },
  ]),
  postAddReserve
);
router.get("/fetch_reserves", getFetchReserves);
router.get("/fetch_reserve/:reserveId", getFetcheReserve);
router.delete("/delete_reserve/:reserveId", deleteReserve);

module.exports = router;
