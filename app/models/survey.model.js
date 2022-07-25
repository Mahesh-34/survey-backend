module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define("survey", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    duration: {
      type: Sequelize.STRING,
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    }
  });
  return Survey;
};