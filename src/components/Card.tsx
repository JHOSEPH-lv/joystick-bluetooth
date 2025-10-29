import React, { ReactNode } from "react";
import "./../assets/css/Card.css";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card-base ${className}`}>{children}</div>;
};
