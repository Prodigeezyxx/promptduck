
import { memo } from 'react';

const MatrixRain = memo(() => {
  return (
    <div className="matrix-container">
      {Array.from({ length: 5 }).map((_, patternIndex) => (
        <div key={patternIndex} className="matrix-pattern">
          {Array.from({ length: 40 }).map((_, columnIndex) => (
            <div key={columnIndex} className="matrix-column"></div>
          ))}
        </div>
      ))}
    </div>
  );
});

MatrixRain.displayName = 'MatrixRain';

export default MatrixRain;
