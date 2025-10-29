import React, { ReactNode, useRef } from "react";
import "./../assets/css/Button.css";

type ButtonVariant = "default" | "primary" | "secondary" | "success" | "danger" | "ghost";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  onMouseDown,
  onMouseUp,
  className = "",
  disabled = false,
  variant = "default",
}) => {
  const variantClass = `btn-${variant}`;
  const touchActive = useRef(false);

  const handleTouchStart = () => {
    touchActive.current = true;
    onMouseDown?.();
  };

  const handleTouchEnd = () => {
    onMouseUp?.();
    // desactivar tras un pequeño delay para evitar falsos positivos
    setTimeout(() => {
      touchActive.current = false;
    }, 100);
  };

  const handleMouseDown = () => {
    if (touchActive.current) return;
    onMouseDown?.();
  };

  const handleMouseUp = () => {
    if (touchActive.current) return;
    onMouseUp?.();
  };

  return (
    <button
      className={`btn-base ${variantClass} ${className}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
