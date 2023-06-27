import React, { useState } from "react";
import {
  ConnectWalletIcon,
  LoginBgcIcon,
  LoginCenterIcon,
  TipIcon,
} from "../../icons";

import "./index.scss";
import { MetamaskActions, useSnapClient } from "../../hooks/useSnapClient";
import { useIonLoading } from "@ionic/react";
import { useStore } from "../../services/mobx/service";
import { observer } from "mobx-react";
import { Button } from "../../components/Button";
import { SignIn, SignUp } from "../../components/LoginModal";
import { RenderWalletAddressBox } from "../../components/LoginModal/WalletAddressBox/WalletAddressBox";
import { Modal } from "../../components/Modal";
import { useConnectMQ } from "../../hooks/useLogin";

interface IProps {}

const Login: React.FC<IProps> = () => {
  const [signInVisible, setSignInVisible] = useState<boolean>(false)
  const [signUpVisible, setSignUpVisible] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')
  const [userid, setUserid] = useState<string>('')
  const store = useStore();
  const [present, dismiss] = useIonLoading();
  const [errorInfo, setErrorInfo] = useState("");
  const { dispatch } = useSnapClient()
  const { detectUser, connect, signUpAndConnect} = useConnectMQ()

  const onConnectClick = async () => {
    await present({
      message: "Connecting...",
      spinner: "circles",
    });
    try {
      const res = await detectUser()
      if (!res) {
        await dismiss()
        return
      }
      const { userExist, userid, address } = res
      setAddress(address)
      setUserid(userid)
      if (userExist) {
        setSignInVisible(true)
        return
      }
      setSignUpVisible(true)
    } finally {
      await dismiss()
    }
  }

  const onSignUpSubmit = async (password: string) => {
    if (!password) {
      return
    }
    await present({
      message: "Connecting...",
      spinner: "circles",
    });
    try {
      const res = await signUpAndConnect({
        userid,
        password,
        address,
      })
      console.log(res, 'onSignUpSubmit')
      store.setIsConnected(true);
      dispatch({
        type: MetamaskActions.SetConnected,
        payload: true,
      })
    } finally {
      await dismiss()
      setSignUpVisible(false)
    }
  }

  const onSignInSubmit = async (password: string) => {
    if (!password) {
      return
    }
    await present({
      message: "Connecting...",
      spinner: "circles",
    });
    try {
      const res = await connect({
        userid,
        password,
        address,
      })
      console.log(res, 'onSignInSubmit')
      store.setIsConnected(true);
      dispatch({
        type: MetamaskActions.SetConnected,
        payload: true,
      })
    } finally {
      setSignInVisible(false)
      await dismiss()
    }
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
          Let's get started with your decentralized trip now!
        </div>
        <div className="walletConnect-btnBox">
          <Button
            icon={<ConnectWalletIcon />}
            className={"channelBtn"}
            onClick={onConnectClick}
            title="Connect to Web3MQ"
          />
        </div>
      </div>
      <Modal visible={signUpVisible} closeModal={() => setSignUpVisible(false)}>
        <div className="modalBody">
          <SignUp
            showLoading={false}
            errorInfo={errorInfo}
            submitSignUp={onSignUpSubmit}
            addressBox={<RenderWalletAddressBox address={address} />}
          />
        </div>
      </Modal>
      <Modal visible={signInVisible} closeModal={() => setSignInVisible(false)}>
        <div className="modalBody">
          <SignIn
            showLoading={false}
            errorInfo={errorInfo}
            submitLogin={onSignInSubmit}
            addressBox={<RenderWalletAddressBox address={address} />}
          />
        </div>
      </Modal>
    </div>
  );
};

export default observer(Login);
