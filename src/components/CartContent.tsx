import React, { ReactNode } from "react";
import "./../assets/css/cardContent.css";

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};
