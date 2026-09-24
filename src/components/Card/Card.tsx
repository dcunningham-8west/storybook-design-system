import React from 'react';

// Define the TypeScript interface for your props
export interface CardProps {
  title: string;
  description: string;
  tag?: string;
  isHighlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  tag,
  isHighlighted = false,
}) => {
  return (
    <div
      style={{
        border: isHighlighted ? '2px solid #0055ff' : '1px solid #e2e8f0',
        backgroundColor: isHighlighted ? '#e6f4ea' : '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '320px',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      {tag && (
        <span
          style={{
            fontSize: '12px',
            backgroundColor: '#e2e8f0',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {tag}
        </span>
      )}
      <h3 style={{ margin: '8px 0 4px', fontSize: '18px' }}>{title}</h3>
      <p style={{ margin: 0, color: '#4a5568', fontSize: '14px' }}>
        {description}
      </p>
    </div>
  );
};