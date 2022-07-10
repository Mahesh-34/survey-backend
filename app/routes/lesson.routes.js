module.exports = app => {
  const lessons = require("../controllers/lesson.controller.js");
  var router = require("express").Router();
  // Create a new Lesson for a Lesson
  router.post("/:lessonId/lessons/", lessons.create);
  // Retrieve all Lessons for a Lesson
  router.get("/:lessonId/lessons/", lessons.findAll);
  // Retrieve all published Lessons for a Lesson
  //router.get("/:lessonId/lessons/published", lessons.findAllPublished);
  // Retrieve a single Lesson with id
  router.get("/:lessonId/lessons/:id", lessons.findOne);
  // Update a Lesson with id
  router.put("/:lessonId/lessons/:id", lessons.update);
  // Delete a Lesson with id
  router.delete("/:lessonId/lessons/:id", lessons.delete);
  // Delete all Lessons
  router.delete("/:lessonId/lessons/:id", lessons.deleteAll);
  app.use('/api/lessons', router);
};