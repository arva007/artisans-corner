import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, count = 0, showCount = true, size = 16, interactive = false, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              size={size}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                fill: isFilled ? 'var(--accent)' : 'none',
                color: isFilled ? 'var(--accent)' : 'var(--text-light)',
                transition: 'transform 0.1s ease',
              }}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
            />
          );
        })}
      </div>
      {showCount && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
