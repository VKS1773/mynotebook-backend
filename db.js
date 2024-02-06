const mongoose = require("mongoose");
const mongoURL = process.env.REACT_APP_MONGODB_URL;
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
