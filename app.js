require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

//bring all routes here
const userRoute = require("./routes/users");

//****** Database Connection *******//
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB CONNECTED");
  });

//****** Middlewares *******//

// parse application/json
app.use(express.json());
// Cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//****** Use Routes ******//
app.use("/api/user", userRoute);

//****** Server Setup ******//
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
