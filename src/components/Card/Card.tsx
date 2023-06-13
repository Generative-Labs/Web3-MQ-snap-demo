import { ReactNode } from 'react';
import './Card.scss'

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};


export const Card = ({ content, disabled = false, fullWidth }: CardProps) => {
  const { title, description, button } = content;
  return (
    <div className="CardWrapper" style={ disabled ?  { filter: 'opacity(.4)'} : {} }>
      {title && (
        <p className="Title">{title}</p>
      )}
      <p className="Description">{description}</p>
      {button}
    </div>
  );
};
