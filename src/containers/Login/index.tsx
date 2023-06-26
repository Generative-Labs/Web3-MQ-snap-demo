import React, { useCallback, useEffect, useState } from "react";
import {
  CloseEyesIcon,
  ConnectWalletIcon,
  LoginBgcIcon,
  LoginCenterIcon,
  LoginErrorIcon,
  OpenEyesIcon,
  TipIcon,
} from "../../icons";

import "./index.scss";
import { useConnectSnap, useSnapClient } from "../../hooks/useSnapClient";
import {
  ConnectRpcDto,
  RegisterToWeb3MQDto,
  WalletType,
} from "../../services/snap/dto";
import { getEthAccount, signWithEth } from "../../utils/metamask";
import { useIonLoading } from "@ionic/react";
import { useStore } from "../../services/mobx/service";
import { observer } from "mobx-react";
import { Button } from "../../components/Button";

interface IProps {}

const DetectUserExsit: React.FC<IProps> = () => {
  const { snapClient, state: { isFlask, installedSnap } } = useSnapClient();
  const [userExist, setUserExsit] = useState<undefined | boolean>(undefined)
  const store = useStore();
  const handleConnectClick = useConnectSnap();
  const [present, dismiss] = useIonLoading();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");


  const detectUserExist = useCallback(async () => {
    const { address } = await getEthAccount();
    const { userExist } = await snapClient.checkUserExist({ address });
    setUserExsit(userExist)
  }, [snapClient])

  useEffect(() => {
    detectUserExist()
  }, [detectUserExist])

  return (
    <div className="login_container">
      <div className="test-bgc">
        <LoginBgcIcon />
      </div>
      <div className="connectBtnBox">
        <LoginCenterIcon />
        <div className="connectBtnBoxTitle">Welcome to Snap</div>
        <div className="connectBtnBoxText">
          Let's get started with your decentralized trip now!
        </div>
        <div className="walletConnect-btnBox">
          <Button
            className={"channelBtn"}
            onClick={detectUserExist}
            title="Connect to Web3Mq"
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

export default observer(DetectUserExsit);
