import { useState, useEffect } from 'react';

const MatchingGame = ({ pairs, onComplete }) => {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selected, setSelected] = useState({ left: null, right: null });
  const [matched, setMatched] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Shuffle items
    const shuffledLeft = [...pairs].sort(() => Math.random() - 0.5);
    const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  }, [pairs]);

  const handleLeftClick = (index) => {
    if (matched.includes(index)) return;
    setSelected(prev => ({ ...prev, left: index }));

    if (selected.right !== null) {
      checkMatch(index, selected.right);
    }
  };

  const handleRightClick = (index) => {
    if (matched.includes(index)) return;
    setSelected(prev => ({ ...prev, right: index }));

    if (selected.left !== null) {
      checkMatch(selected.left, index);
    }
  };

  const checkMatch = (leftIdx, rightIdx) => {
    const leftItem = leftItems[leftIdx];
    const rightItem = rightItems[rightIdx];

    if (leftItem.id === rightItem.id) {
      setMatched(prev => [...prev, leftIdx, rightIdx]);
      setSelected({ left: null, right: null });

      if (matched.length + 2 >= pairs.length * 2) {
        setCompleted(true);
        if (onComplete) {
          onComplete(pairs.length, pairs.length);
        }
      }
    } else {
      setIncorrect([leftIdx, rightIdx]);
      setTimeout(() => {
        setIncorrect([]);
        setSelected({ left: null, right: null });
      }, 1000);
    }
  };

  const handleReset = () => {
    const shuffledLeft = [...pairs].sort(() => Math.random() - 0.5);
    const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
    setSelected({ left: null, right: null });
    setMatched([]);
    setIncorrect([]);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Perfect Match!
        </h3>
        <p className="text-gray-600 mb-4">
          You matched all {pairs.length} pairs correctly
        </p>
        <button onClick={handleReset} className="btn-secondary">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Matching Game</h2>
        <span className="text-sm text-gray-600">
          Matched: {matched.length / 2} / {pairs.length}
        </span>
      </div>

      <p className="text-gray-600 mb-6">
        Click on a German word and its English translation to match them.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - German */}
        <div className="space-y-3">
          {leftItems.map((item, index) => {
            const isSelected = selected.left === index;
            const isMatched = matched.includes(index);
            const isIncorrect = incorrect.includes(index);

            return (
              <button
                key={`left-${index}`}
                onClick={() => handleLeftClick(index)}
                disabled={isMatched}
                className={`w-full p-4 rounded-lg font-medium transition-all text-left ${
                  isMatched
                    ? 'bg-green-100 text-green-700 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : isIncorrect
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white border-2 border-gray-200 hover:border-primary-300 hover:shadow-md text-gray-900'
                }`}
              >
                {item.left}
              </button>
            );
          })}
        </div>

        {/* Right Column - English */}
        <div className="space-y-3">
          {rightItems.map((item, index) => {
            const isSelected = selected.right === index;
            const isMatched = matched.includes(index);
            const isIncorrect = incorrect.includes(index);

            return (
              <button
                key={`right-${index}`}
                onClick={() => handleRightClick(index)}
                disabled={isMatched}
                className={`w-full p-4 rounded-lg font-medium transition-all text-left ${
                  isMatched
                    ? 'bg-green-100 text-green-700 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : isIncorrect
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white border-2 border-gray-200 hover:border-primary-300 hover:shadow-md text-gray-900'
                }`}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;
