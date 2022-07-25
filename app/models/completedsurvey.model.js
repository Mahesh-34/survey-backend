module.exports = (sequelize, Sequelize) => {
  const Completedsurvey = sequelize.define("completed_survey", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    surveyId: {
      type: Sequelize.INTEGER,
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
    submittedBy: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    }
  });
  return Completedsurvey;
};