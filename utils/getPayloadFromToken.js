const jwt = require("jsonwebtoken");

const getPayloadFromToken = async (req, res) => {
  let output = null;
  const jwt_token = req.headers["authorization"].split(" ")[1];
  jwt.verify(jwt_token, process.env.JWT_SECRET_KEY, async (error, payload) => {
    if (error) {
      res.status(401);
      res.send("Invalid JWT Token");
    } else {
      output = payload;
    }
  });
  return output;
};

module.exports = getPayloadFromToken;
