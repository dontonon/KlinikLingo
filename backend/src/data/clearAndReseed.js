import pool from '../config/database.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function clearAndReseed() {
  try {
    console.log('🗑️  Clearing existing lessons...\n');

    // Delete all lessons (this will also cascade delete related progress and exercise results)
    const deleteResult = await pool.query('DELETE FROM lessons');
    console.log(`✓ Deleted ${deleteResult.rowCount} lessons\n`);

    // Reset the sequence for the lessons id
    await pool.query('ALTER SEQUENCE lessons_id_seq RESTART WITH 1');
    console.log('✓ Reset lesson ID sequence\n');

    console.log('🌱 Running seed script...\n');

    // Run the seed script
    const { stdout, stderr } = await execAsync('npm run seed', {
      cwd: '/home/user/KlinikLingo/backend'
    });

    console.log(stdout);
    if (stderr) console.error(stderr);

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

clearAndReseed();
