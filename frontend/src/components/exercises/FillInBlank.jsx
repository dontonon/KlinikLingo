import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const FillInBlank = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newResults = questions.map((q, index) => {
      const userAnswer = answers[index].trim().toLowerCase();
      const correctAnswer = q.answer.toLowerCase();
      return userAnswer === correctAnswer;
    });

    setResults(newResults);
    setSubmitted(true);

    const score = newResults.filter(r => r).length;
    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(''));
    setSubmitted(false);
    setResults([]);
  };

  const score = results.filter(r => r).length;
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fill in the Blanks</h2>
        {submitted && (
          <div className="text-lg font-semibold">
            Score: <span className="text-primary-600">{score}/{questions.length}</span>
            {' '}({percentage}%)
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-3">{question.question}</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={submitted}
                    className={`input-field ${
                      submitted
                        ? results[index]
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : ''
                    }`}
                    placeholder="Type your answer..."
                  />
                  {submitted && (
                    <div className="flex-shrink-0">
                      {results[index] ? (
                        <CheckIcon className="w-6 h-6 text-green-600" />
                      ) : (
                        <XMarkIcon className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                {submitted && !results[index] && (
                  <div className="mt-2 text-sm text-red-600">
                    Correct answer: <span className="font-medium">{question.answer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {submitted ? (
          <button onClick={handleReset} className="btn-secondary">
            Try Again
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answers.some(a => !a.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default FillInBlank;
