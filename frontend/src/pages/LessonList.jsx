import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI } from '../services/api';
import LessonCard from '../components/LessonCard';
import ProgressBar from '../components/ProgressBar';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const LessonList = () => {
  const { level } = useParams();
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
      <Link
        to="/dashboard"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Level {level} Lessons
        </h1>
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
            // Lock lessons if previous lesson is not completed
            const isLocked = index > 0 && !lessons[index - 1].progress?.completed;
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
