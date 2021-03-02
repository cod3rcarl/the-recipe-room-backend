const jwt = require("jsonwebtoken");
const config = require("../../config/config");

function verifyRole(req, res, next) {
  jwt.verify(req.token, config.SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(401).json({ message: "Unauthorized" });
    } else {
      try {
        const user = await User.findById({ user: authData.user._id });

        if (authData.user.role === "gold") {
          req.role = user;
          next();
        }
      } catch (error) {
        res.status(400).json({
          message: `You are not authorised to view this page, upgrade your membership`,
        });
      }
    }
  });
}

module.exports = verifyRole;
