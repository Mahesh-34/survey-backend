module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("user_sessions", {
    userId: {
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