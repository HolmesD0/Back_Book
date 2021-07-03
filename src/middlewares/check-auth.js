const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(
      token,
      "f8becfafde96551661521b24579dad51dfc7c98ecf0f8fce96fea283eb968d9c3f2a31be3baf42e67d1519d83209a2f66550014f75aae9411acaf35246a7c94c"
    );
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};
