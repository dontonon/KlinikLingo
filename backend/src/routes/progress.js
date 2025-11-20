import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's overall progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        l.level,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN up.completed = true THEN 1 END) as completed_lessons,
        ROUND(AVG(up.score), 2) as average_score
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE l.is_placeholder = false
      GROUP BY l.level
      ORDER BY
        CASE l.level
          WHEN 'A1' THEN 1
          WHEN 'A2' THEN 2
          WHEN 'B1' THEN 3
          WHEN 'B2' THEN 4
          WHEN 'C1' THEN 5
          WHEN 'C2' THEN 6
        END`,
      [req.user.userId]
    );

    const progress = result.rows.map(row => ({
      level: row.level,
      totalLessons: parseInt(row.total_lessons),
      completedLessons: parseInt(row.completed_lessons),
      averageScore: row.average_score ? parseFloat(row.average_score) : null,
      percentage: row.total_lessons > 0
        ? Math.round((row.completed_lessons / row.total_lessons) * 100)
        : 0
    }));

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get progress for specific lesson
router.get('/lesson/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [req.user.userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.json({ completed: false, score: null });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({ error: 'Failed to get lesson progress' });
  }
});

// Update progress for a lesson
router.post('/lesson/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { completed, score, timeSpent } = req.body;

    const result = await pool.query(
      `INSERT INTO user_progress (user_id, lesson_id, completed, score, time_spent, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET
         completed = EXCLUDED.completed,
         score = EXCLUDED.score,
         time_spent = EXCLUDED.time_spent,
         completed_at = EXCLUDED.completed_at,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        req.user.userId,
        lessonId,
        completed || false,
        score || null,
        timeSpent || null,
        completed ? new Date() : null
      ]
    );

    res.json({
      message: 'Progress updated successfully',
      progress: result.rows[0]
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Save exercise result
router.post('/exercise', authenticateToken, async (req, res) => {
  try {
    const { lessonId, exerciseType, score, totalQuestions, answers } = req.body;

    const result = await pool.query(
      `INSERT INTO exercise_results (user_id, lesson_id, exercise_type, score, total_questions, answers)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, lessonId, exerciseType, score, totalQuestions, answers]
    );

    res.json({
      message: 'Exercise result saved',
      result: result.rows[0]
    });
  } catch (error) {
    console.error('Save exercise result error:', error);
    res.status(500).json({ error: 'Failed to save exercise result' });
  }
});

// Get exercise history for a lesson
router.get('/exercise/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      'SELECT * FROM exercise_results WHERE user_id = $1 AND lesson_id = $2 ORDER BY completed_at DESC',
      [req.user.userId, lessonId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get exercise history error:', error);
    res.status(500).json({ error: 'Failed to get exercise history' });
  }
});

export default router;
