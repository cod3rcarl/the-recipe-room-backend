const express = require("express");
const path = require("path");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config/config");
const app = express();
const PORT = config.PORT || 5000;

connectDB();

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/users.routes");

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

app.use(express.static(path.join(__dirname, "public")));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  //close server
  server.close(() => process.exit(1)); // 1 is exit with failure
});
