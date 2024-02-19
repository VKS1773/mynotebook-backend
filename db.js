const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/Mynotebook";
const connectToMongo = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(mongoURL, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to mongo succesfully");
    }
  });
};
module.exports = connectToMongo;
