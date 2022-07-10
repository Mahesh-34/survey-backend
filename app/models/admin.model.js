module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
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
    verification_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    forgotpassword_code: {
      type: Sequelize.STRING,
      allowNull: true
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
  return Admin;
};