// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ error: "Neautorizuotas asmuo" });
//     }

//     const verified = jwt.verify(token, "TokenPassword");
//     req.user = {
//       id: verified.id,
//       email: verified.email,
//     };

//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: "Neautorizuotas asmuo" });
//   }
// };

// module.exports = auth;


const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Neautorizuotas asmuo" });
    }

    const verified = jwt.verify(token, "TokenPassword");
    req.user = {
      id: verified.id,
      email: verified.email,
      role: verified.role, // Include the role property
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Neautorizuotas asmuo" });
  }
};

module.exports = auth;
