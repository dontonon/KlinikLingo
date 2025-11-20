import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { AcademicCapIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressAPI.getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelStatus = (level) => {
    const levelProgress = progress.find(p => p.level === level);
    if (!levelProgress || levelProgress.totalLessons === 0) {
      return { status: 'coming-soon', percentage: 0, completed: 0, total: 0 };
    }
    return {
      status: 'active',
      percentage: levelProgress.percentage,
      completed: levelProgress.completedLessons,
      total: levelProgress.totalLessons,
      averageScore: levelProgress.averageScore
    };
  };

  const overallProgress = progress.reduce((acc, level) => {
    acc.totalLessons += level.totalLessons;
    acc.completedLessons += level.completedLessons;
    return acc;
  }, { totalLessons: 0, completedLessons: 0 });

  const overallPercentage = overallProgress.totalLessons > 0
    ? Math.round((overallProgress.completedLessons / overallProgress.totalLessons) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Willkommen{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-xl text-gray-600">
          Continue your German learning journey for healthcare professionals
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <AcademicCapIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {overallProgress.completedLessons}
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrophyIcon className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {overallPercentage}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {user?.currentLevel || 'A1'}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level) => {
            const levelData = getLevelStatus(level);
            const isComingSoon = levelData.status === 'coming-soon';

            return (
              <Link
                key={level}
                to={isComingSoon ? '#' : `/lessons/${level}`}
                className={`card ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 transform transition-all'}`}
                onClick={(e) => isComingSoon && e.preventDefault()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{level}</h3>
                  {isComingSoon ? (
                    <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-primary-600">
                      {levelData.completed}/{levelData.total} lessons
                    </span>
                  )}
                </div>

                {!isComingSoon && (
                  <>
                    <ProgressBar percentage={levelData.percentage} showLabel={false} />
                    {levelData.averageScore !== null && (
                      <div className="mt-3 text-sm text-gray-600">
                        Average score: <span className="font-medium">{levelData.averageScore}%</span>
                      </div>
                    )}
                  </>
                )}

                {isComingSoon && (
                  <p className="text-sm text-gray-500">
                    This level is not yet available. Complete previous levels to unlock.
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Info */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">About KlinikLingo</h3>
        <p className="text-gray-700">
          Learn German following the Goethe Institut curriculum (A1-C2) with integrated healthcare vocabulary.
          Each lesson combines everyday conversational German with specialized nursing and medical terminology.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
