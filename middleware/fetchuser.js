var jwt = require("jsonwebtoken");
const JWT_SECRET = "youaredoinggood";
const fetchuser = (req, res, next) => {
  //get the user from jwt token and add id to reuest obj
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ errors: "please provide authentication token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: "please provide authentication token" });
  }
};

module.exports = fetchuser;
