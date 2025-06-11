
import { memo } from 'react';

const MatrixRain = memo(() => {
  return (
    <div className="matrix-container">
      <div className="matrix-pattern">
        {Array.from({ length: 50 }).map((_, columnIndex) => (
          <div key={columnIndex} className="matrix-column"></div>
        ))}
      </div>
    </div>
  );
});

MatrixRain.displayName = 'MatrixRain';

export default MatrixRain;
