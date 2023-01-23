const Reserves = require("../../models/reserves");
const logger = require("../../util/logger");

exports.postAddReserve = (req, res, next) => {
  Reserves.findOne({ name: req.body.name }).exec((err, reserve) => {
    if (err) return res.status(400).json({ message: "Something went wrong" });
    if (reserve)
      return res.status(400).json({
        message: "This Reserve has been Created, Please choose another name",
      });
    let albumList = [];
    req.files.album.forEach((element) => {
      albumList.push(element["location"]);
    });
    const reserveInfo = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      ownerImage: req.files.ownerImage[0]["location"],
      locationImage: req.files.locationImage[0]["location"],
      rating: 4,
      album: albumList,
    };

    const newReserve = new Reserves(reserveInfo);
    newReserve.save((err, success) => {
      if (err) return res.status(400).json({ message: "Something went wrong" });
      if (success) {
        return res.status(200).json(success);
      }
    });
  });
};

exports.getFetchReserves = (req, res, next) => {
  Reserves.find().exec((err, data) => {
    if (err) {
      logger.info("Something went wrong");
      return res.status(400).json({ message: "Something went wrong" });
    }
    if (data) {
      logger.info("Gotten all the reserves");
      return res.status(200).json(data);
    }
  });
};

exports.getFetcheReserve = (req, res, next) => {
  Reserves.findById(req.params.reserveId, (err, success) => {
    if (err) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!success) {
      return res.status(400).json({ message: "Reserve not found" });
    }
    return res.status(200).json({ success });
  });
};

exports.deleteReserve = (req, res) => {
  Reserves.findByIdAndDelete(req.params.reserveId, (err, success) => {
    if (err) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!success) {
      return res
        .status(400)
        .json({ message: "Reserve with this id not found" });
    }

    return res.status(200).json({ success });
  });
};
