const multerS3 = require("multer-s3");
const multer = require("multer");
const aws = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
const jwt = require("jsonwebtoken");

// Amazon S3 Storage configuration
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAU7RKH77UIGK3CGUJ",
    secretAccessKey: "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",
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

//Multer S3 middleware
exports.uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "travelbuck",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

//Main token verification
exports.verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const authHeader = header && header.split(" ")[1];
  if (authHeader != null) {
    jwt.verify(authHeader, process.env.JWT_SECRET_KEY, (err, token) => {
      if (err) res.status(403).json("Invalid token");
      req.user = token;
      next();
    });
  } else {
    res.status(401).json({ message: "No authorization found" });
  }
};

//Using the above token verification to authorize the user
exports.verifyTokenAndAuthorization = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.admin) {
      next();
    } else {
      res.status(403).json({ message: "You are not authorized" });
    }
  });
};
