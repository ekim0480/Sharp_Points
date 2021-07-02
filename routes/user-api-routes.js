module.exports = function (app) {
  // GET route to get user data
  app.get("/userData", function (req, res) {
    if (req.user === undefined) {
      // The user is not logged in
      res.json({});
    } else {
      res.json({
        hasAdmin: req.user.hasAdmin,
      });
    }
  });
};
