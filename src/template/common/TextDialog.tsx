import React from "react";

interface CardProps {
  text: string;
}

const GradientCard: React.FC<CardProps> = ({ text = "" }: CardProps) => {
  return (
    <div className="w-full flex items-center justify-center py-10">

      <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[20%] h-[50px] rounded-full bg-[#E3BCF1] blur-3xl opacity-20" />
      {/* Outer wrapper = gradient border */}
      <div className="rounded-[40px] p-[1px] bg-[linear-gradient(224.28deg,#E3BCF1_6.83%,#4E3368_93.12%)]">
        {/* Inner content = background */}
        <div className="w-[350px] md:w-[500px] h-[100px] p-5 text-center rounded-[40px] bg-[#0A0310] flex items-center justify-center text-[16px]">
          {text}
        </div>
      </div>
    </div>
  );
};

export default GradientCard;
