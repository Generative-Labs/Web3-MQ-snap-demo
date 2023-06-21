import React, { useState } from "react";
import {
  CloseEyesIcon,
  ConnectWalletIcon,
  LoginBgcIcon,
  LoginCenterIcon,
  LoginErrorIcon,
  OpenEyesIcon,
  TipIcon,
} from "../icons";

import "./index.scss";
import { useConnectSnap, useSnapClient } from "../hooks/useSnapClient";
import {
  ConnectRpcDto,
  RegisterToWeb3MQDto,
  WalletType,
} from "../services/snap/dto";
import { getEthAccount, signWithEth } from "../utils/metamask";
import { useIonLoading } from "@ionic/react";
import { useStore } from "../services/mobx/service";
import { observer } from "mobx-react";
import { Button } from "../components/Button";

interface IProps {}

const Login: React.FC<IProps> = () => {
  const { snapClient, isFlask, installedSnap } = useSnapClient();
  const store = useStore();
  const handleConnectClick = useConnectSnap();
  const [present, dismiss] = useIonLoading();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const getNewMainKeys = async (
    address: string,
    password: string,
    walletType?: WalletType
  ) => {
    const { signContent } = await snapClient.getMainKeySignContent({
      password,
      walletType: walletType || "eth",
      address,
    });
    const { sign } = await signWithEth(signContent, address);
    const { publicKey, secretKey } = await snapClient.getMainKeypairBySignature(
      {
        signature: sign,
        password,
      }
    );
    return { publicKey, secretKey };
  };
  const connectToWeb3mq = async () => {
    if (!isFlask) {
      return;
    }
    if (!password) {
      setErrorInfo("invalid password");
      return;
    }
    await present({
      message: "Connecting...",
      spinner: "circles",
    });
    const { address } = await getEthAccount();
    let mainPubKey = "";
    let mainPriKey = "";
    const {
      privateKey: localPriKey,
      publicKey: localPubKey,
      address: localAddress,
    } = await snapClient.exportWeb3MQKeys();

    if (address === localAddress && localPriKey && localPubKey) {
      // the secret key pair already exists in the snap state
      mainPriKey = localPriKey;
      mainPubKey = localPubKey;
    } else {
      // need to create main keys
      const { publicKey, secretKey } = await getNewMainKeys(address, password);
      mainPubKey = publicKey;
      mainPriKey = secretKey;
    }

    const { userid, userExist } = await snapClient.checkUserExist({
      address,
    });
    console.log(userExist, "userExist");
    if (!userExist) {
      const signContentRes = await snapClient.getRegisterSignContent({
        userid,
        mainPublicKey: mainPubKey,
        didType: "eth",
        didValue: address,
      });
      console.log(signContentRes, "signContentRes");
      const { signContent, registerTime } = signContentRes;
      const { sign } = await signWithEth(signContent, address);
      const params: RegisterToWeb3MQDto = {
        walletAddress: address,
        password,
        mainPublicKey: mainPubKey,
        mainPrivateKey: mainPriKey,
        walletType: "eth",
        signature: sign,
        registerSignContent: signContent,
        registerTime,
        userid,
      };
      await snapClient.registerToWeb3MQNetwork(params);
    } else {
      console.log("ready login");
      const params: ConnectRpcDto = {
        walletAddress: address,
        password,
        mainPublicKey: mainPubKey,
        mainPrivateKey: mainPriKey,
        userid,
      };
      console.log(params, "params");
      await snapClient.connectToWeb3MQ(params);
    }
    store.setIsConnected(true);
    await dismiss();
  };

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
        <div className="inputContainer">
          <div className={"inputBox"}>
            <div className={"title"}>Password</div>
            <div className="inputValue">
              <input
                placeholder="Write something..."
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setErrorInfo("");
                  }
                  setPassword(e.target.value);
                }}
                value={password}
              />
              {showPassword ? (
                <div
                  className="eyesBox"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                >
                  <OpenEyesIcon />
                </div>
              ) : (
                <div
                  className="eyesBox"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                >
                  <CloseEyesIcon />
                </div>
              )}
            </div>
          </div>
          {errorInfo && (
            <div className="errorBox">
              <div className="errorIcon">
                <LoginErrorIcon />
              </div>
              <div>{errorInfo}</div>
            </div>
          )}
        </div>
        {/* <div>{errorInfo}</div> */}
        <div className="pwdTip">
          If you have not registered, enter your password to register
          automatically
        </div>
        <div className="walletConnect-btnBox">
          <Button
            className={"channelBtn"}
            onClick={handleConnectClick}
            title="Install Snap"
          />
        </div>
        <div className="walletConnect-btnBox">
          <Button
            className={"channelBtn"}
            onClick={connectToWeb3mq}
            title="Connect"
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

export default observer(Login);
