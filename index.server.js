const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const userRoutes = require("./src/routes/auth");
const messageRoutes = require("./src/routes/messages");
const reserveRoutes = require("./src/routes/reserves");
const morganMiddleware = require("./src/middlewares/morgan");
// const logger = require("./util/logger");

var server = http.createServer(app);

//Environment variables configuration
dotenv.config();

//mongoose connection string
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.rqq9w.mongodb.net/${process.env.MONGO_DATATBASE_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Database connected successfully...!!!!");
  })
  .catch((e) => console.log("Database connection failed"));

//Middlewares
app.use(bodyParser());
app.use(cors());

app.use(morganMiddleware);

//Routes path
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/reserves", reserveRoutes);

//Socket io initialization
var io = require("./socket.js").init(server);

io.on("connection", (socket) => {
  console.log("Socket io connected");
  socket.on("createRoom", ({ name }) => {});
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port} 🔥`));
