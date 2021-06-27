var bCrypt = require("bcryptjs");

module.exports = function (passport, user) {
  var User = user;
  var LocalStrategy = require("passport-local").Strategy;

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, email, password, done) {
        var generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        };
        User.findOne({
          where: {
            email: email,
          },
        }).then(function (user) {
          if (user) {
            console.log("email exists");
            return done(null, false, {
              message: "That email is already taken",
            });
          } else {
            var userPassword = generateHash(password);

            var data = {
              email: email,

              password: userPassword,

              firstname: req.body.firstname,

              lastname: req.body.lastname,
            };

            console.log(data);
            User.create(data).then(function (newUser, created) {
              if (!newUser) {
                console.log("not created");
                return done(null, false);
              }

              if (newUser) {
                console.log("new user created");
                return done(null, newUser);
              }
            });
          }
        });
        //serialize
        passport.serializeUser(function (user, done) {
          done(null, user.id);
        });

        // deserialize user
        passport.deserializeUser(function (id, done) {
          User.findByPk(id).then(function (user) {
            if (user) {
              done(null, user.get());
            } else {
              done(user.errors, null);
            }
          });
        });
      }
    )
  );
  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email

        usernameField: "email",

        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, email, password, done) {
        var User = user;

        var isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };

        User.findOne({
          where: {
            email: email,
          },
        })
          .then(function (user) {
            if (!user) {
              console.log("email doesn't exist");
              return done(null, false, {
                message: "Email does not exist",
              });
            }

            if (!isValidPassword(user.password, password)) {
              console.log("password incorrect");
              return done(null, false, {
                message: "Incorrect password.",
              });
            }

            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Signin",
            });
          });
      }
    )
  );
};
