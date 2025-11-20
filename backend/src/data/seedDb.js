import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Check if lessons already exist
    const existingCheck = await pool.query('SELECT COUNT(*) FROM lessons');
    const existingCount = parseInt(existingCheck.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  Database already contains ${existingCount} lessons.`);
      console.log('Do you want to clear and reseed? (This will delete existing data)');
      console.log('To proceed, delete all lessons manually first.\n');
      process.exit(0);
    }

    // Load A1 lessons
    const a1Path = path.join(__dirname, 'lessons-a1.json');
    const a1Lessons = JSON.parse(fs.readFileSync(a1Path, 'utf8'));

    console.log(`📚 Loading ${a1Lessons.length} A1 lessons...`);
    for (const lesson of a1Lessons) {
      await pool.query(
        `INSERT INTO lessons (lesson_code, level, order_num, title, description, content, is_placeholder)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          lesson.lesson_code,
          lesson.level,
          lesson.order_num,
          lesson.title,
          lesson.description,
          JSON.stringify(lesson.content),
          false
        ]
      );
      console.log(`  ✓ ${lesson.lesson_code}: ${lesson.title}`);
    }

    // Create A2 sample lessons (2 real + 8 placeholders for now)
    console.log('\n📚 Creating A2 lessons...');

    const a2Lesson1 = {
      lesson_code: 'A2-01',
      level: 'A2',
      order_num: 1,
      title: 'Daily Routines and Schedules',
      description: 'Learn to describe daily routines and work schedules',
      content: {
        generalVocab: [
          { german: 'aufstehen', english: 'to wake up' },
          { german: 'frühstücken', english: 'to have breakfast' },
          { german: 'arbeiten', english: 'to work' },
          { german: 'die Pause', english: 'the break' },
          { german: 'die Schicht', english: 'the shift' }
        ],
        nursingVocab: [
          { german: 'die Frühschicht', english: 'the early shift' },
          { german: 'die Spätschicht', english: 'the late shift' },
          { german: 'die Nachtschicht', english: 'the night shift' },
          { german: 'die Übergabe', english: 'the handover' },
          { german: 'die Visite', english: 'the ward round' }
        ],
        phrases: [
          { german: 'Ich arbeite in der Frühschicht.', english: 'I work the early shift.' },
          { german: 'Wann ist die Übergabe?', english: 'When is the handover?' },
          { german: 'Die Visite beginnt um 9 Uhr.', english: 'The ward round starts at 9 o\'clock.' }
        ],
        grammar: [
          {
            title: 'Separable Verbs',
            explanation: 'Many German verbs are separable. The prefix moves to the end of the sentence in present tense.',
            examples: ['Ich stehe um 6 Uhr auf.', 'Er fängt um 7 Uhr an.']
          }
        ],
        exercises: [
          {
            type: 'flashcard',
            cards: [
              { front: 'die Schicht', back: 'the shift' },
              { front: 'die Übergabe', back: 'the handover' },
              { front: 'die Visite', back: 'the ward round' }
            ]
          }
        ]
      }
    };

    await pool.query(
      `INSERT INTO lessons (lesson_code, level, order_num, title, description, content, is_placeholder)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        a2Lesson1.lesson_code,
        a2Lesson1.level,
        a2Lesson1.order_num,
        a2Lesson1.title,
        a2Lesson1.description,
        JSON.stringify(a2Lesson1.content),
        false
      ]
    );
    console.log(`  ✓ ${a2Lesson1.lesson_code}: ${a2Lesson1.title}`);

    // Create placeholder A2 lessons
    const a2Placeholders = [
      { code: 'A2-02', title: 'Health and Body Parts', order: 2 },
      { code: 'A2-03', title: 'Medical Procedures', order: 3 },
      { code: 'A2-04', title: 'Medications and Dosages', order: 4 },
      { code: 'A2-05', title: 'Patient Care Activities', order: 5 },
      { code: 'A2-06', title: 'Emergency Situations', order: 6 },
      { code: 'A2-07', title: 'Medical Equipment', order: 7 },
      { code: 'A2-08', title: 'Documentation and Reports', order: 8 },
      { code: 'A2-09', title: 'Talking with Relatives', order: 9 },
      { code: 'A2-10', title: 'Review and Practice', order: 10 }
    ];

    for (const placeholder of a2Placeholders) {
      await pool.query(
        `INSERT INTO lessons (lesson_code, level, order_num, title, description, content, is_placeholder)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [placeholder.code, 'A2', placeholder.order, placeholder.title, 'Coming soon...', JSON.stringify({}), true]
      );
      console.log(`  ✓ ${placeholder.code}: ${placeholder.title} (placeholder)`);
    }

    // Create placeholder levels B1-C2
    console.log('\n📚 Creating placeholder levels B1-C2...');
    const placeholderLevels = ['B1', 'B2', 'C1', 'C2'];

    for (const level of placeholderLevels) {
      for (let i = 1; i <= 10; i++) {
        const code = `${level}-${String(i).padStart(2, '0')}`;
        await pool.query(
          `INSERT INTO lessons (lesson_code, level, order_num, title, description, content, is_placeholder)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [code, level, i, `${level} Lesson ${i}`, 'Coming soon...', JSON.stringify({}), true]
        );
      }
      console.log(`  ✓ Created 10 placeholder lessons for ${level}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - ${a1Lessons.length} A1 lessons (complete)`);
    console.log(`  - 1 A2 lesson (complete)`);
    console.log(`  - 9 A2 lessons (placeholder)`);
    console.log(`  - 40 B1-C2 lessons (placeholder)`);

    const totalCount = await pool.query('SELECT COUNT(*) FROM lessons');
    console.log(`\n  Total: ${totalCount.rows[0].count} lessons in database\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
