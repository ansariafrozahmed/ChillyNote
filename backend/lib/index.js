const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No Authorization header provided" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ error: "Invalid Authorization header format" });
  }
  const token = tokenParts[1];

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (data.exp < currentTime) {
      // Token expired
      return res.status(401).json({ error: "Token expired" });
    }

    req.userId = data.id;
    next();
  } catch (error) {
    // If there's an error verifying the token (e.g., invalid token format or signature), return 500 status
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
