const { getLearnerProgress } = require('../services/progressService');

async function getProgress(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid learner ID is required' });
    }

    const progress = await getLearnerProgress(Number(id));

    if (!progress) {
      return res.status(404).json({ error: 'Learner not found' });
    }

    return res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProgress };
