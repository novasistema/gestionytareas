import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  invertForDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'h-9', 
  variant = 'full',
  invertForDark = true 
}) => {
  // Brand colors from the uploaded Ferretería Bruzzone image
  const blueColor = '#2b7a9e';
  const darkTextColor = invertForDark ? '#ffffff' : '#1a1a1a';
  const blackStrokeColor = invertForDark ? '#f4f4f5' : '#1a1a1a';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Top blue bar and upper B curve */}
        <path
          d="M 6 18 H 115 C 135 18, 148 28, 148 42 C 148 54, 137 62, 120 64 C 140 66, 150 76, 150 90 C 150 104, 135 110, 115 110 H 70 V 98 H 114 C 127 98, 137 94, 137 87 C 137 80, 127 76, 114 76 H 92 V 64 H 114 C 126 64, 135 60, 135 53 C 135 46, 126 42, 114 42 H 45 V 30 H 6 Z"
          fill={blueColor}
        />
        {/* Bolt dot on the left */}
        <circle cx="14" cy="54" r="8" fill={blackStrokeColor} />
        {/* Lower F stem and horizontal bar */}
        <path
          d="M 6 70 H 45 V 82 H 18 V 110 H 6 Z"
          fill={blackStrokeColor}
        />
        <rect x="25" y="70" width="40" height="12" fill={blackStrokeColor} />
      </svg>
    );
  }

  if (variant === 'badge') {
    // Renders the logo inside a pristine white card badge exactly as the original image
    return (
      <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm flex items-center shrink-0">
        <svg
          viewBox="0 0 520 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* FB Monogram */}
          <g transform="translate(5, 5) scale(0.8)">
            {/* Top blue bar and upper B curve */}
            <path
              d="M 6 12 H 115 C 135 12, 148 22, 148 36 C 148 48, 137 56, 120 58 C 140 60, 150 70, 150 84 C 150 98, 135 104, 115 104 H 70 V 92 H 114 C 127 92, 137 88, 137 81 C 137 74, 127 70, 114 70 H 92 V 58 H 114 C 126 58, 135 54, 135 47 C 135 40, 126 36, 114 36 H 45 V 24 H 6 Z"
              fill={blueColor}
            />
            {/* Bolt dot */}
            <circle cx="14" cy="48" r="8" fill="#1a1a1a" />
            {/* Lower F stem */}
            <path
              d="M 6 64 H 45 V 76 H 18 V 104 H 6 Z"
              fill="#1a1a1a"
            />
            <rect x="25" y="64" width="40" height="12" fill="#1a1a1a" />
          </g>

          {/* Text: FERRETERIA */}
          <text
            x="165"
            y="42"
            fill={blueColor}
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="36"
            letterSpacing="2.5"
          >
            FERRETERIA
          </text>

          {/* Text: BRUZZONE */}
          <text
            x="165"
            y="88"
            fill="#1a1a1a"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="900"
            fontSize="48"
            letterSpacing="3"
          >
            BRUZZONE
          </text>
        </svg>
      </div>
    );
  }

  // Full variant (transparent, adapted for dark header)
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 520 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* FB Monogram */}
        <g transform="translate(5, 5) scale(0.8)">
          {/* Top blue bar and upper B curve */}
          <path
            d="M 6 12 H 115 C 135 12, 148 22, 148 36 C 148 48, 137 56, 120 58 C 140 60, 150 70, 150 84 C 150 98, 135 104, 115 104 H 70 V 92 H 114 C 127 92, 137 88, 137 81 C 137 74, 127 70, 114 70 H 92 V 58 H 114 C 126 58, 135 54, 135 47 C 135 40, 126 36, 114 36 H 45 V 24 H 6 Z"
            fill={blueColor}
          />
          {/* Bolt dot */}
          <circle cx="14" cy="48" r="8" fill={blackStrokeColor} />
          {/* Lower F stem */}
          <path
            d="M 6 64 H 45 V 76 H 18 V 104 H 6 Z"
            fill={blackStrokeColor}
          />
          <rect x="25" y="64" width="40" height="12" fill={blackStrokeColor} />
        </g>

        {/* Text: FERRETERIA */}
        <text
          x="165"
          y="42"
          fill={blueColor}
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="36"
          letterSpacing="2.5"
        >
          FERRETERIA
        </text>

        {/* Text: BRUZZONE */}
        <text
          x="165"
          y="88"
          fill={darkTextColor}
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="3"
        >
          BRUZZONE
        </text>
      </svg>
    </div>
  );
};
