const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loggerMiddleware = require("./../middleware/logger");

// Get all users
exports.getUsers = (req, res) => {
  try {
    User.find()
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((error) => res.status(404).json({ error: "Įvyko klaida" }));
  } catch {
    res.status(500).json({ error: "Įvyko klaida" });
  }
};
//create user
exports.createUser = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!passwordRegex.test(password))
    return res.status(422).json({
      error:
        "Slaptažodis turi būti mažiausiai 6 simbolių ilgio ir jį turėtų sudaryti raidės ir bent vienas skaičius ar specialusis simbolis",
    });
  else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, passwordHash) => {
        try {
          User.findOne({ email: email }).then((existingUser) => {
            if (existingUser) {
              res
                .status(422)
                .json({ error: "Vartotojas egzistuoja." });
            } else {
              const createdUser = new User({
                name,
                email,
                password: passwordHash,
                role,
              });
              createdUser
                .save()

                .then((doc) => {
                  req.logger.info(
                    `Administratorius sukūrė vartotoją ${createdUser.email}`
                  );
                })

                .catch((error) =>
                  res.status(404).json({ error: error.message })
                );
            }
          });
        } catch {
          res.status(500).json({ error: "Registracija nepavyko" });
        }
      });
    });
  }
};

// Edit user
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, password } = req.body;

    // Get the current user from the JWT token
    const token = req.cookies.token;
    const decoded = jwt.verify(token, "TokenPassword");
    const currentUser = await User.findById(decoded.id);

    // Check if the current user is an admin or the user being edited
    if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
      return res.status(401).json({ error: "Neautorizuotas vartotojas" });
    }

    // If a new password was provided, hash it
    let passwordHash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    // Update the user with the new information
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        email: email || undefined,
        password: passwordHash || undefined
      },
      { new: true, runValidators: true }
    );

      

    if (!updatedUser) {
      return res.status(404).json({ error: "Vartotojas nerastas" });
    }
    req.logger.info(`Administratorius redagavo vartotoją ${updatedUser.email}`)

    res.status(200).json(updatedUser);
  } catch (err) {
    
    res.status(500).json({ error: "Įvyko klaida" });
  }
};

// Delete user
exports.deleteUser = (req, res) => {
  let { id } = req.params;
  User.findByIdAndDelete(id)
    .then((doc) => {
      res.status(200).json(doc);
      req.logger.info(`Administratorius panaikino vartotoją ${doc.email}`)
    })
    .catch((error) => res.status(404).json(error));
};

//SIGN UP

exports.signup = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!passwordRegex.test(password))
    return res.status(422).json({
      error:
        "Slaptažodis turi būti mažiausiai 6 simbolių ilgio ir jį turėtų sudaryti raidės ir bent vienas skaičius ar specialusis simbolis",
    });
  else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, passwordHash) => {
        try {
          User.findOne({ email: email }).then((existingUser) => {
            if (existingUser) {
              res
                .status(422)
                .json({ error: "Vartotojas egzistuoja. Prašome prisijungti" });
            } else {
              const createdUser = new User({
                name,
                email,
                password: passwordHash,
                role,
              });
              createdUser
                .save()
                .then((doc) => {
                  const token = jwt.sign(
                    {
                      id: createdUser._id,
                      name: createdUser.name,
                      email: createdUser.email,
                      role: createdUser.role,
                    },
                    "TokenPassword"
                  );
                  //send the token in the cookie

                  res
                    .cookie("token", token, {
                      httpOnly: true,
                    })

                    .send(doc);
                })
                .then(() => {
                  req._id = createdUser._id;
                  next();
                })

                .catch((error) =>
                  res.status(404).json({ error: error.message })
                );
            }
          });
        } catch {
          res.status(500).json({ error: "Registracija nepavyko" });
        }
      });
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(401)
        .json({ error: "Netinkamas el. paštas arba slaptažodis" });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect)
      return res
        .status(401)
        .json({ error: "Netinkamas el. paštas arba slaptažodis" });

    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      "TokenPassword"
    );
    req._id = existingUser._id;
    next();
    //send the token in the cookie

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch {
    res.status(500).json({ error: "Prisijungimas nepavyko" });
  }
};

exports.logout = (req, res, next) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .end(() => {
      next();
    });
};

exports.loggedIn = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(false);

    jwt.verify(token, "TokenPassword");

    res.send(true);
  } catch (err) {
    res.json(false);
  }
};

exports.getName = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(false);

    const verified = jwt.verify(token, "TokenPassword");

    // Assuming the user's name is stored in the decoded token
    const userName = verified.name;
    const role = verified.role;
    res.json({ name: userName, role: role });
  } catch (err) {
    res.json(err);
  }
};
