const { expressjwt: jwt } = require("express-jwt");

const authJWT = () => {
  const secret = process.env.SECRET_TOKEN;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
};
async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    return true; // if the isAdmin flag in payload is false, then we reject the token
  }

  return false;
}

module.exports = authJWT;
