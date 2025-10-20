import React from "react";

interface CardProps {
  text: string;
}


const GradientCard: React.FC<CardProps> = ({ text = "" }: CardProps) => {
  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
      <div style={{ display: 'inline-block', background: 'linear-gradient(224.28deg,#E3BCF1 6.83%,#4E3368 93.12%)', borderRadius: '32px', padding: '2px' }}>
        <div style={{ background: '#0A0310', borderRadius: '32px', padding: '24px 32px', color: '#fff', fontSize: '16px', maxWidth: '400px', textAlign: 'center' }}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default GradientCard;
