function verifyToken(req, res, next) {
  const bearerToken = req.header("user");
  if (typeof bearerToken !== "undefined") {
    req.token = bearerToken;
    next();
  } else {
    res
      .status(403)
      .json({ message: "You are not authorized to access this page" });
  }
}

module.exports = verifyToken;
