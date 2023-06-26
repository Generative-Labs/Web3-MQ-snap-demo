import React from "react";
import {
  LoginBgcIcon,
  LoginCenterIcon,
  TipIcon,
} from "../icons";

import "./index.scss";
import { useSnapClient } from "../hooks/useSnapClient";
import { observer } from "mobx-react";
import { Button } from "../components/Button";

interface IProps {}

const NotFlaskLogin: React.FC<IProps> = () => {
  const { state: { isFlask } } = useSnapClient();

  function installFlask() {
    window.open('https://metamask.io/flask/', '_blank')
  }

  return (
    <div className="login_container">
      <div className="test-bgc">
        <LoginBgcIcon />
      </div>
      <div className="connectBtnBox">
        <LoginCenterIcon />
        <div className="connectBtnBoxTitle">Welcome to Snap</div>
        <div className="connectBtnBoxText">
          Please install Flask first
        </div>
        <div className="walletConnect-btnBox">
          <Button
            className={"disable"}
            onClick={installFlask}
            title="Install flask"
          />
        </div>
        {!isFlask && (
          <div className="notInstalled">
            <TipIcon />
            <p>
              Not installed MetaMask Flask{" "}
              <a
                className="ephasis"
                href="https://metamask.io/flask/"
                target="_blank"
                rel="noreferrer"
              >
                install MetaMask Flask
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(NotFlaskLogin);
