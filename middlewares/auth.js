const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require("../errors/unauthorized");

const handleAuthError = () => {
  throw new Unauthorized("Необходима авторизация");
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
