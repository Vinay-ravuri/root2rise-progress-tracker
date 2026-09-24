const { completeLesson } = require('../services/lessonService');

async function markComplete(req, res, next) {
  try {
    const { id } = req.params;
    const { learnerId } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid lesson ID is required' });
    }

    if (!learnerId) {
      return res.status(400).json({ error: 'learnerId is required' });
    }

    if (!Number.isInteger(Number(learnerId))) {
      return res.status(400).json({ error: 'learnerId must be an integer' });
    }

    const result = await completeLesson(Number(id), Number(learnerId));

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    if (result.alreadyCompleted) {
      return res.status(200).json({ message: 'Lesson already completed' });
    }

    return res.status(201).json({
      message: 'Lesson completed successfully',
      progressId: result.progressId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { markComplete };
