import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('📦 Initializing database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✓ Database schema created successfully');

    // Check if we need to seed data
    const result = await pool.query('SELECT COUNT(*) FROM lessons');
    const lessonCount = parseInt(result.rows[0].count);

    if (lessonCount === 0) {
      console.log('📝 No lessons found, seeding will be needed...');
      console.log('✓ Database initialized - ready for content');
    } else {
      console.log(`✓ Database already contains ${lessonCount} lessons`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
