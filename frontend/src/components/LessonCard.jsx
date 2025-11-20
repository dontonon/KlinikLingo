import { Link } from 'react-router-dom';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const LessonCard = ({ lesson, isLocked = false }) => {
  const { lesson_code, title, description, progress, is_placeholder } = lesson;
  const isCompleted = progress?.completed || false;

  if (is_placeholder) {
    return (
      <div className="card opacity-60 cursor-not-allowed">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
            </div>
            <p className="text-sm text-gray-500">{description || 'Coming soon...'}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
            Coming Soon
          </span>
        </div>
      </div>
    );
  }

  const CardContent = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {isCompleted && (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            )}
            {isLocked && (
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {progress?.score !== null && progress?.score !== undefined && (
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-primary-600">{progress.score}%</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 font-medium">{lesson_code}</span>
        {isCompleted && (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Completed
          </span>
        )}
        {!isCompleted && !isLocked && (
          <span className="text-primary-600 font-medium">Start Lesson →</span>
        )}
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div className="card opacity-60 cursor-not-allowed">
        {CardContent}
      </div>
    );
  }

  return (
    <Link to={`/lesson/${lesson_code}`} className="card block hover:scale-105 transform transition-all">
      {CardContent}
    </Link>
  );
};

export default LessonCard;
