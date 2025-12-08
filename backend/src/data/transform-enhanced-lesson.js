import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the enhanced lesson template
const enhancedTemplatePath = path.join(__dirname, 'enhanced-lesson-template.json');
const enhancedTemplate = JSON.parse(fs.readFileSync(enhancedTemplatePath, 'utf8'));

// Read existing lessons
const lessonsPath = path.join(__dirname, 'lessons-a1.json');
const existingLessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

// Transform enhanced template to match database schema
const transformedLesson = {
  lesson_code: enhancedTemplate.lesson_code,
  level: enhancedTemplate.level,
  order_num: enhancedTemplate.order_num,
  title: enhancedTemplate.title,
  description: enhancedTemplate.description,
  content: {
    metadata: enhancedTemplate.metadata,
    learningObjectives: enhancedTemplate.learningObjectives,
    scenario: enhancedTemplate.scenario,
    keyPhrases: enhancedTemplate.content.keyPhrases,
    vocabulary: enhancedTemplate.content.vocabulary,
    grammar: enhancedTemplate.content.grammar,
    dialogues: enhancedTemplate.content.dialogues,
    exercises: enhancedTemplate.content.exercises,
    supplementaryResources: enhancedTemplate.supplementaryResources,
    assessmentCriteria: enhancedTemplate.assessmentCriteria
  }
};

// Replace A1-01 with enhanced version, keep other lessons
const updatedLessons = existingLessons.map(lesson =>
  lesson.lesson_code === 'A1-01' ? transformedLesson : lesson
);

// Write back to lessons-a1.json
fs.writeFileSync(lessonsPath, JSON.stringify(updatedLessons, null, 2), 'utf8');

console.log('✓ Successfully transformed and updated lessons-a1.json');
console.log(`✓ Replaced A1-01 with enhanced CEFR-compliant version`);
console.log(`✓ Total lessons in file: ${updatedLessons.length}`);
