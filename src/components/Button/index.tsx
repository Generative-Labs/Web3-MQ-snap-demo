import { useState } from "react";
import "./index.scss";

interface IProps {
  title: string;
  hoverTitle?: string;
  disable?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}
export function Button({
  icon,
  title,
  hoverTitle = '',
  className = "",
  onClick,
  disable = false,
}: IProps) {
  const [isHovered, setIsHovered] = useState(false);
  const handleHover = () => {
    setIsHovered(!isHovered);
  };
  return (
    <button
      className={`snapDemoBtn ${className} ${disable ? "disable" : ""} ${isHovered ? 'hover': ''}`}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      {icon && icon}
      <div>{isHovered ? hoverTitle || title : title}</div>
    </button>
  );
}
