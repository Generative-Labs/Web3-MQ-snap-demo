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
            <IonButton
              onClick={async () => {
                await present({
                  message: "Connecting...",
                  spinner: "circles",
                });
                await snapClient.connectToWeb3MQ({
                  password: password,
                  nickname: "testAccount",
                });
                store.setIsConnected(true);
                await dismiss();
              }}
              disabled={isConnected}
            >
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
