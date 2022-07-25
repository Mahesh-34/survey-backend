module.exports = app => {
  const general = require("../controllers/general.controller.js");
  var router = require("express").Router();
  router.get("/dashlets", general.dashboard);
  app.use('/api/', router);
};