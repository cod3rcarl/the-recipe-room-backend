const mongoose = require("mongoose");
const config = require("./config");
const connectDB = async () => {
  const conn = await mongoose.connect(config.CONNECT, {
    //following need to be added as options to stop warnings in the console
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
