require("dotenv").config("./.env");
const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.REACT_APP_PORT;
app.set("port", 5000);
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(
    `Mynotebook backend app listening on port http://localhost:${port}`
  );
});
