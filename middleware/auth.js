const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    console.log("bearerHeader : ",bearerHeader)
    if (typeof bearerHeader != "undefined") {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log("user : ", user);
      req.token = user;
      next();
    } else {
      res.status(401).json({ message: "No Token Provided" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = auth;
