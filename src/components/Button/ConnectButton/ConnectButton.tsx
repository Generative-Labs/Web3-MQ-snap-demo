import { ComponentProps } from "react";
import { ReactComponent as FlaskFox } from '../../../assets/flask_fox.svg';

export const ConnectButton = (props: any) => {
  return (
    <div className="button" {...props}>
      <FlaskFox />
      <p>Connect</p>
    </div>
  );
};