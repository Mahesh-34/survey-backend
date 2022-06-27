module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use'
      },
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });
  return User;
};