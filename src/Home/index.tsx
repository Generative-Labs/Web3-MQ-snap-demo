import React, { useEffect, useState } from "react";

import {
  IonAlert,
  IonButton,
  IonCard,
  IonInput,
  useIonLoading,
} from "@ionic/react";

import ss from "./index.module.scss";
import cx from "classnames";
import {
  getKeys,
  getLoginUserId,
  getShortAddressByAddress,
} from "../services/utils/utils";
import SendNotify from "../components/SendNotify";
import { useStore } from "../services/mobx/service";
import { observer } from "mobx-react";
import MobileDemo from "../components/MobileDemo";
import { useSnaps } from "../hooks/useSnaps";
import Channels from "../components/Channels";
import { useRows } from "../hooks/useRows";
import { useConnectSnap, useSnapClient } from "../hooks/useSnapClient";
import Contacts from "../components/Contacts";
import { getEthAccount, signWithEth } from "../utils/metamask";
import {
  ConnectRpcDto,
  RegisterToWeb3MQDto,
  WalletType,
} from "../services/snap/dto";

const Home: React.FC = () => {
  const { snapClient, isFlask, installedSnap } = useSnapClient();
  const handleConnectClick = useConnectSnap();
  const store = useStore();
  const {
    isConnected,
    loginUserId,
    showAlert,
    setShowAlert,
    errorMessage,
    setErrorMessage,
    setLoginUserId,
  } = store;
  const [present, dismiss] = useIonLoading();
  const { getChannelList } = useSnaps();
  const [password, setPassword] = useState("123123");
  const { showRows } = useRows();

  useEffect(() => {
    const init = async () => {
      if (getKeys()) {
        await dismiss();
        await present({
          message: "Loading...",
        });
        setLoginUserId(getLoginUserId());
        await getChannelList();
        await dismiss();
      }
    };
    init();
  }, []);

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
    console.log(userExist,'userExist')
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
      console.log('ready login')
      const params: ConnectRpcDto = {
        walletAddress: address,
        password,
        mainPublicKey: mainPubKey,
        mainPrivateKey: mainPriKey,
        userid,
      };
      console.log(params, 'params')
      await snapClient.connectToWeb3MQ(params);
    }
    store.setIsConnected(true);
    await dismiss();
  };

  return (
    <div className={ss.container}>
      <h1> Web3 MQ test-dapp </h1>
      <div
        className={cx(ss.content, {
          [ss.twoContentRow]: showRows === 2,
          [ss.oneContentRow]: showRows === 1,
        })}
      >
        <div className={ss.ionCard}>
          <h2>web3mq snaps installed? {installedSnap ? "true" : "false"}</h2>
          <h2>is flask wallet? {isFlask ? "true" : "false"}</h2>
          <h2>Status {getShortAddressByAddress(loginUserId || "")}</h2>
          <IonButton onClick={handleConnectClick}>
            override installed snap
          </IonButton>
          {!installedSnap && isFlask && (
            <IonButton onClick={handleConnectClick}>install</IonButton>
          )}

          <IonCard>
            <h1>Connect to MetaMask Flask</h1>
            <IonInput
              className={ss.input}
              value={password}
              placeholder="Enter password"
              onIonChange={(e) => {
                setPassword(e.detail.value!);
              }}
            />
            <IonButton onClick={connectToWeb3mq} disabled={isConnected}>
              {isConnected ? "Connected" : "Connect"}
            </IonButton>
          </IonCard>
        </div>
        {showRows === 3 && (
          <>
            <Channels />
            <Contacts />
            <MobileDemo />
          </>
        )}
        {[1, 2].includes(showRows) && (
          <>
            <Channels />
            <Contacts />
            <MobileDemo />
          </>
        )}
      </div>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => {
          setShowAlert(false);
          setErrorMessage("");
        }}
        header={"Error"}
        message={errorMessage}
        buttons={["Dismiss"]}
      />
    </div>
  );
};
export default observer(Home);
