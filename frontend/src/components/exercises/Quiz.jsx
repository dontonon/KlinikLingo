import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      const score = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;

      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz Complete!
        </h3>
        <div className="text-4xl font-bold text-primary-600 mb-2">
          {score}/{questions.length}
        </div>
        <p className="text-gray-600 mb-6">
          {percentage}% correct
        </p>

        <div className="mb-6 max-w-md mx-auto space-y-3">
          {questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.correctAnswer;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg text-left ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="text-sm text-gray-700">
                    Question {index + 1}: {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleReset} className="btn-secondary">
          Take Quiz Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
        <span className="text-sm text-gray-600">
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="card mb-6">
        <div className="mb-6">
          <p className="text-xl text-gray-900">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  showCorrect
                    ? 'bg-green-100 border-2 border-green-500 text-green-900'
                    : showIncorrect
                    ? 'bg-red-100 border-2 border-red-500 text-red-900'
                    : isSelected
                    ? 'bg-primary-100 border-2 border-primary-500 text-primary-900'
                    : 'bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-900'
                } ${showResult ? 'cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrect && <CheckIcon className="w-6 h-6 text-green-600" />}
                  {showIncorrect && <XMarkIcon className="w-6 h-6 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              {isCorrect ? (
                <CheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XMarkIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {question.explanation && (
                  <p className="text-sm text-gray-700 mt-1">{question.explanation}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {!showResult ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === undefined}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
