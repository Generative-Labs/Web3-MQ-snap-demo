import React from "react";
import {
  LoginBgcIcon,
  LoginCenterIcon,
} from "../../icons";

import "./index.scss";
import { useConnectSnap } from "../../hooks/useSnapClient";
import { observer } from "mobx-react";
import { Button } from "../../components/Button";

interface IProps {}

const NotSnapIntalledLogin: React.FC<IProps> = () => {
  const handleConnectClick = useConnectSnap();

  return (
    <div className="login_container">
      <div className="test-bgc">
        <LoginBgcIcon />
      </div>
      <div className="connectBtnBox">
        <LoginCenterIcon />
        <div className="connectBtnBoxTitle">Welcome to Snap</div>
        <div className="connectBtnBoxText">
          Please install Snap first
        </div>
        <div className="walletConnect-btnBox">
          <Button
            onClick={handleConnectClick}
            title="Install Snap"
          />
        </div>
      </div>
    </div>
  );
};

export default observer(NotSnapIntalledLogin);
