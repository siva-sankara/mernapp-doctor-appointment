const JWt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // const token = req.header["authorization"].split(" ")[1];
    let token = req.cookies.token;
    JWt.verify(token, process.env.JwT_SECRET, (err, decode) => {
      if (err) {
        return res.status(500).send({
          message: "Auth Failed with some error",
          success: false,
        });
        
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({
      message: "Auth FAiled bokkka",
      success: false,
    });
  }
  // let decode = await JWt.verify(token,process.env.JET_SECRET);
};
