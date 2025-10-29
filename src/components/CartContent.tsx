import React, { ReactNode } from "react";
import "./../assets/css/CardContent.css";

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};
