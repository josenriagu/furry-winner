const jwt = require("jsonwebtoken");

const secret = require("../../config/secrets");
const genError = require("./error");
const m = require("./messageStrings");

// This helper function will serve both cases in restrict middleware
function verify(req, res, next) {
  const token = req.headers.authorization;
  jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
    if (err) {
      next(genError(401, m.tokenInvalid));
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
}

module.exports = {
  generateToken(user) {
    const payload = {
      sub: user.id,
      // You can add more keys and useful pieces of info beyond this line
    };
    const options = {
      expiresIn: "30d",
    };
    return jwt.sign(payload, secret.jwtSecret, options);
  },
  restrict(req, res, next) {
    const token = req.headers.authorization;
    const { method, originalUrl } = req;
    const { id } = req.params;

    // Let's permit specific GET methods for questions route, even if no token (pseudo-private);
    if (method === "GET" && (originalUrl === `${m.qBase}` || `${m.qBase}/${id}`)) {
      if (token) {
        verify(req, res, next);
      } else {
        next();
      }
    } else if (token) {
      verify(req, res, next);
    } else {
      next(genError(400, m.supplyToken));
    }
  },
};
