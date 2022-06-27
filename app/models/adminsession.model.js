module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("admin_sessions", {
    adminId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
    },
    secret: {
      type: Sequelize.STRING,
    },
    ip: {
      type: Sequelize.STRING,
      allowNull: false
    },
    useragent: {
      type: Sequelize.STRING,
      allowNull: true
    },
  });
  return Session;
};