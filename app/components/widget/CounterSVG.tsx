import React from 'react';

type CounterData = {
  day: string;
  count: number;
  max: number; // Added max prop for total count
  borderColor?: string; // Optional prop for border color
  backgroundColor?: string; // Optional prop for background color
  width?: number;
};

const CounterSVG: React.FC<CounterData> = ({
  day,
  count,
  max,
  borderColor = 'gold', // Default value if not provided
  backgroundColor = 'black', // Default value if not provided
  width = 80
}) => {
  return (
    <div style={{ display: 'inline-block', padding: '10px' }}>
      <svg width={width} height={width} xmlns="http://www.w3.org/2000/svg">
        {/* Background with rounded corners and customizable border */}
        <rect 
          width="100%" 
          height="100%" 
          rx="15" 
          ry="15" 
          fill={backgroundColor}

          strokeWidth="2"
        />
        
        {/* Banner with customizable border */}
        <rect 
          width="100%" 
          height="30%" 
          rx="15" 
          ry="15" 
          fill={backgroundColor} 
        />
        
        {/* Text for "Nuit du ..." */}
        <text 
          x="50%" 
          y="20%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fontSize="16" 
          fill="white"
        >
          {`Nuit du ${day}`}
        </text>
        
        {/* Value in the body */}
        <text 
          x="50%" 
          y="60%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fontSize="40" 
          fill="white"
        >
          {count}
        </text>
        
        {/* Fraction display for count / max */}
        <text 
          x="90%" 
          y="90%" 
          dominantBaseline="middle" 
          textAnchor="end" 
          fontSize="10" 
          fill="white"
        >
          {`/ ${max}`}
        </text>
      </svg>
    </div>
  );
};

export default CounterSVG;
