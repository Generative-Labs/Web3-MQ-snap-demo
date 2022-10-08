import React, { useEffect, useState } from "react";

import { IonAlert, IonButton, IonCard, useIonLoading } from "@ionic/react";

import ss from "./index.module.scss";
import cx from "classnames";
import { useDebounceFn } from "ahooks";
import { getInstance, sendMessageBySnaps } from "../services/utils/snaps";
import {
  getKeys,
  getLoginUserId,
  getShortAddressByAddress,
  sleep,
} from "../services/utils/utils";
import SendNotify from "../components/SendNotify";
import { useStore } from "../services/mobx/service";
import { observer } from "mobx-react";
import MobileDemo from "../components/MobileDemo";
import { useSnaps } from "../hooks/useSnaps";
import Channels from "../components/Channels";
import { useRows } from "../hooks/useRows";

const Home: React.FC = () => {
  const store = useStore();
  const {
    isConnected,
    activeChannel,
    loginUserId,
    showAlert,
    setShowAlert,
    errorMessage,
    setErrorMessage,
    setLoginUserId,
  } = store;
    const [present, dismiss] = useIonLoading();
    const {
      register,
      getSnaps,
      creatRoom,
      connectWeb3Mq,
      getMessages,
      getChannelList,
    } = useSnaps();
    const { showRows } = useRows();

    useEffect(() => {
      console.log(123123123);
      window.addEventListener(
        "message",
        (event) => {
          // console.log(event, 'event')
          console.log(event, "event");
        },
        false
      );

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
      // init();
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
          <h2>Status {getShortAddressByAddress(loginUserId || "")}</h2>
          <IonCard>
            <h1>Connect to MetaMask Flask</h1>
            <IonButton
              onClick={async () => {
                await present({
                  message: "Connecting...",
                  spinner: "circles",
                });
                await getSnaps();
                await dismiss();
              }}
            >
              getSnaps
            </IonButton>
            <IonButton
              onClick={async () => {
                await present({
                  message: "Connecting...",
                  spinner: "circles",
                });
                await connectWeb3Mq();
                await dismiss();
              }}
              disabled={isConnected}
            >
              {isConnected ? "Connected" : "Connect"}
            </IonButton>
            <h1>Connect to Web3MQ network</h1>
            <IonButton
              onClick={async () => {
                await present({
                  message: "Loading...",
                  spinner: "circles",
                });
                await connectWeb3Mq();
                await dismiss();
              }}
              disabled={!!getKeys()}
            >
              {getKeys() ? "Registered" : "Register And Login"}
            </IonButton>
          </IonCard>
        </div>
        {showRows === 3 && (
          <>
            <SendNotify />
            <Channels />
            <MobileDemo />
          </>
        )}
        {[1, 2].includes(showRows) && (
          <>
            <Channels />
            <MobileDemo />
            <SendNotify />
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
