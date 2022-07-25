const db = require("../models");
const Completedsurvey = db.completedsurveys;
const User = db.users;
const Op = db.Sequelize.Op;

User.hasMany(Completedsurvey, {foreignKey : 'id'});
Completedsurvey.belongsTo(User, {foreignKey : 'submittedBy'})

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a Completedsurvey
  const completedsurvey = {
    name: req.body.name,
    description: req.body.description,    
    content:req.body.content,    
    duration:req.body.duration,
    submittedBy: req.body.submittedBy,    
    surveyId: req.body.surveyId,
    status: req.body.status ? req.body.status : false

  };
  // Save Completedsurvey in the database
  Completedsurvey.create(completedsurvey)
    .then(data => {
       res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Completedsurvey."
      });
    });
};
// Retrieve all Completedsurveys from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Completedsurvey.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving completedsurveys."
      });
    });
};
// Find a single Completedsurvey with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Completedsurvey.findOne({ where: { id: id }, include:[{ model:User, required: false }]})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Completedsurvey with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Completedsurvey with id=" + id
      });
    });
};
// Update a Completedsurvey by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Completedsurvey.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Completedsurvey was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Completedsurvey with id=${id}. Maybe Completedsurvey was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Completedsurvey with id=" + id
      });
    });
};
// Delete a Completedsurvey with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Completedsurvey.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Completedsurvey was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Completedsurvey with id=${id}. Maybe Completedsurvey was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Completedsurvey with id=" + id
      });
    });
};
// Delete all Completedsurveys from the database.
exports.deleteAll = (req, res) => {
  Completedsurvey.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Completedsurveys were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all completedsurveys."
      });
    });
};
// Find all published Completedsurveys
exports.findAllCompletedsurveys = (req, res) => {
  Completedsurvey.findAll({ where: { is_completedsurvey: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving completedsurveys."
      });
    });
};
exports.findAllSurveysByUser = (req, res) => {
  const id = req.params.id;
  Completedsurvey.findAll({ where: { submittedBy: id } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving surveys."
      });
    });
};
exports.findAllSurveysByQuestion = (req, res) => {
  const id = req.params.id;
  Completedsurvey.findAll({ where: { surveyId: id }, include:[{ model:User, required: false }]})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving surveys."
      });
    });
};