import { ReactNode } from "react";
import { ChatIcon } from "../../icons";
import './index.scss'

interface IProp {
  icon: ReactNode;
  title: string;
}

export function EmptyList({ icon, title }: IProp) {
  return (
    <div className="emptyList">
      {icon}
      <div className="emptyMsg">
        {title}
      </div>
    </div>
  )
}