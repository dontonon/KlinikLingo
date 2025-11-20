import express from 'express';
import pool from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons (with optional user progress)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { level } = req.query;
    let query = 'SELECT id, lesson_code, level, order_num, title, description, is_placeholder FROM lessons';
    const params = [];

    if (level) {
      query += ' WHERE level = $1';
      params.push(level);
    }

    query += ' ORDER BY order_num ASC';

    const lessonsResult = await pool.query(query, params);
    let lessons = lessonsResult.rows;

    // If user is authenticated, get their progress
    if (req.user) {
      const progressResult = await pool.query(
        'SELECT lesson_id, completed, score FROM user_progress WHERE user_id = $1',
        [req.user.userId]
      );

      const progressMap = {};
      progressResult.rows.forEach(p => {
        progressMap[p.lesson_id] = {
          completed: p.completed,
          score: p.score
        };
      });

      lessons = lessons.map(lesson => ({
        ...lesson,
        progress: progressMap[lesson.id] || { completed: false, score: null }
      }));
    }

    res.json(lessons);
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

// Get single lesson by ID or code
router.get('/:identifier', optionalAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);

    const query = isNumeric
      ? 'SELECT * FROM lessons WHERE id = $1'
      : 'SELECT * FROM lessons WHERE lesson_code = $1';

    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    let lesson = result.rows[0];

    // If user is authenticated, get their progress
    if (req.user) {
      const progressResult = await pool.query(
        'SELECT completed, score, time_spent, completed_at FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
        [req.user.userId, lesson.id]
      );

      if (progressResult.rows.length > 0) {
        lesson.progress = progressResult.rows[0];
      }
    }

    res.json(lesson);
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// Get lessons by level (grouped)
router.get('/level/:level', optionalAuth, async (req, res) => {
  try {
    const { level } = req.params;
    const result = await pool.query(
      'SELECT id, lesson_code, level, order_num, title, description, is_placeholder FROM lessons WHERE level = $1 ORDER BY order_num ASC',
      [level.toUpperCase()]
    );

    let lessons = result.rows;

    // If user is authenticated, get their progress
    if (req.user) {
      const progressResult = await pool.query(
        'SELECT lesson_id, completed, score FROM user_progress WHERE user_id = $1',
        [req.user.userId]
      );

      const progressMap = {};
      progressResult.rows.forEach(p => {
        progressMap[p.lesson_id] = {
          completed: p.completed,
          score: p.score
        };
      });

      lessons = lessons.map(lesson => ({
        ...lesson,
        progress: progressMap[lesson.id] || { completed: false, score: null }
      }));
    }

    res.json(lessons);
  } catch (error) {
    console.error('Get lessons by level error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

export default router;
