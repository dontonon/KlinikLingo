import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LessonCard from '../components/LessonCard';
import ProgressBar from '../components/ProgressBar';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const LessonList = () => {
  const { level } = useParams();
  const { isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [level]);

  const fetchLessons = async () => {
    try {
      const response = await lessonAPI.getLessonsByLevel(level);
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = lessons.filter(l => l.progress?.completed).length;
  const progressPercentage = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Guest user banner */}
      {!isAuthenticated && (
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                👋 Welcome to KlinikLingo!
              </h3>
              <p className="text-gray-600">
                You're browsing as a guest. Sign up to track your progress and save your achievements!
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Level selector */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-2">
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
            <Link
              key={lvl}
              to={`/lessons/${lvl}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                lvl === level
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </Link>
          ))}
        </div>
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 ml-auto"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Dashboard
          </Link>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Level {level} Lessons
        </h1>
        {isAuthenticated && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                <p className="text-sm text-gray-600">
                  {completedCount} of {lessons.length} lessons completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary-600">
                {progressPercentage}%
              </div>
            </div>
            <ProgressBar percentage={progressPercentage} showLabel={false} />
          </div>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">
            No lessons available for this level yet.
          </p>
          <Link to="/dashboard" className="btn-primary inline-block mt-4">
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            // Lock lessons if previous lesson is not completed (only for authenticated users)
            const isLocked = isAuthenticated && index > 0 && !lessons[index - 1].progress?.completed;
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isLocked={isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LessonList;
