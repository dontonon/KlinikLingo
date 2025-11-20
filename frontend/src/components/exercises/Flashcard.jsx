import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Flashcard = ({ cards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
      if (onComplete) {
        onComplete(cards.length, cards.length);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (completed) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Flashcards Complete!
        </h3>
        <p className="text-gray-600">
          You reviewed all {cards.length} cards
        </p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Flashcards</h2>
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden">
            <div className="card h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200">
              <div className="text-sm font-medium text-primary-600 mb-4">GERMAN</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {currentCard.front}
              </div>
              <div className="text-sm text-gray-500 mt-auto">
                Click to flip
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="card h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
              <div className="text-sm font-medium text-green-600 mb-4">ENGLISH</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {currentCard.back}
              </div>
              <div className="text-sm text-gray-500 mt-auto">
                Click to flip
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <span>{currentIndex === cards.length - 1 ? 'Finish' : 'Next'}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Flashcard;
