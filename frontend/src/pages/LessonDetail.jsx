import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lessonAPI, progressAPI } from '../services/api';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Flashcard from '../components/exercises/Flashcard';
import FillInBlank from '../components/exercises/FillInBlank';
import MatchingGame from '../components/exercises/MatchingGame';
import Quiz from '../components/exercises/Quiz';

const LessonDetail = () => {
  const { lessonCode } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [exerciseResults, setExerciseResults] = useState({});

  useEffect(() => {
    fetchLesson();
  }, [lessonCode]);

  const fetchLesson = async () => {
    try {
      const response = await lessonAPI.getLesson(lessonCode);
      setLesson(response.data);
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseComplete = async (exerciseType, score, totalQuestions) => {
    setExerciseResults(prev => ({
      ...prev,
      [exerciseType]: { score, totalQuestions }
    }));

    // Save exercise result
    try {
      await progressAPI.saveExerciseResult({
        lessonId: lesson.id,
        exerciseType,
        score,
        totalQuestions,
        answers: {}
      });
    } catch (error) {
      console.error('Failed to save exercise result:', error);
    }
  };

  const handleMarkComplete = async () => {
    const exerciseCount = Object.keys(exerciseResults).length;
    const totalScore = exerciseCount > 0
      ? Math.round(
          Object.values(exerciseResults).reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / exerciseCount
        )
      : null;

    try {
      await progressAPI.updateProgress(lesson.id, {
        completed: true,
        score: totalScore
      });

      navigate(`/lessons/${lesson.level}`);
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600 text-lg mb-4">Lesson not found</p>
        <Link to="/dashboard" className="btn-primary inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const content = lesson.content || {};

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to={`/lessons/${lesson.level}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back to {lesson.level} Lessons
      </Link>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-primary-600 mb-2 block">
              {lesson.lesson_code}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-gray-600 mt-2">{lesson.description}</p>
            )}
          </div>
          {lesson.progress?.completed && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
              Completed
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            {['content', 'exercises'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'content' ? 'Lesson Content' : 'Practice Exercises'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* General Vocabulary */}
            {content.generalVocab && content.generalVocab.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  General Vocabulary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.generalVocab.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{item.german}</div>
                      <div className="text-gray-600">{item.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nursing Vocabulary */}
            {content.nursingVocab && content.nursingVocab.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Healthcare & Nursing Vocabulary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.nursingVocab.map((item, index) => (
                    <div key={index} className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <div className="font-medium text-gray-900">{item.german}</div>
                      <div className="text-gray-600">{item.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phrases */}
            {content.phrases && content.phrases.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Phrases
                </h2>
                <div className="space-y-3">
                  {content.phrases.map((phrase, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-1">{phrase.german}</div>
                      <div className="text-gray-600">{phrase.english}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar */}
            {content.grammar && content.grammar.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Grammar Points
                </h2>
                <div className="space-y-4">
                  {content.grammar.map((item, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.explanation}</p>
                      {item.examples && item.examples.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {item.examples.map((example, i) => (
                            <div key={i} className="text-sm text-gray-600 italic">
                              {example}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-8">
            {content.exercises && content.exercises.length > 0 ? (
              content.exercises.map((exercise, index) => (
                <div key={index}>
                  {exercise.type === 'flashcard' && (
                    <Flashcard
                      cards={exercise.cards}
                      onComplete={(score, total) => handleExerciseComplete('flashcard', score, total)}
                    />
                  )}
                  {exercise.type === 'fill-in-blank' && (
                    <FillInBlank
                      questions={exercise.questions}
                      onComplete={(score, total) => handleExerciseComplete('fill-in-blank', score, total)}
                    />
                  )}
                  {exercise.type === 'matching' && (
                    <MatchingGame
                      pairs={exercise.pairs}
                      onComplete={(score, total) => handleExerciseComplete('matching', score, total)}
                    />
                  )}
                  {exercise.type === 'quiz' && (
                    <Quiz
                      questions={exercise.questions}
                      onComplete={(score, total) => handleExerciseComplete('quiz', score, total)}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-600">
                No exercises available for this lesson yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mark Complete Button */}
      {!lesson.progress?.completed && (
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to complete this lesson?
          </h3>
          <p className="text-gray-600 mb-4">
            Mark this lesson as complete to unlock the next one.
          </p>
          <button
            onClick={handleMarkComplete}
            className="btn-primary"
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;
