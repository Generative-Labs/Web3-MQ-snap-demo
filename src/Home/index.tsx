import React, { useEffect, useState } from "react";

import { IonAlert, IonButton, IonCard, useIonLoading } from "@ionic/react";

import ss from "./index.module.scss";
import cx from "classnames";
import { useDebounceFn } from "ahooks";
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
import {newSnapId} from "../services/utils/snaps";

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
  const { creatRoom, connectWeb3Mq, getMessages, getChannelList } = useSnaps();
  const { showRows } = useRows();

    async function testCallSnaps() {
        //@ts-ignore
        const result = await window.ethereum.request({ method: 'wallet_getSnaps' });
        console.log(result, 'result')
        //@ts-ignore
        const res =  await ethereum.request({
            method: "wallet_invokeSnap",
            params: {
                snapId: newSnapId,
                request: {
                    method: "testCall",
                    params: {
                        str: '12312',
                        content: '123123123'
                    },
                },
            },
        });
        console.log(res, 'res')
    }
    async function connectToWeb3MQ() {
        //@ts-ignore
        const result = await window.ethereum.request({ method: 'wallet_getSnaps' });
        console.log(result, 'result');
        //@ts-ignore
        const res = await ethereum.request({
            method: 'wallet_invokeSnap',
            params: {
                snapId: newSnapId,
                request: {
                    method: 'connectToWeb3MQ',
                    params: {
                        password: '123123',
                    },
                },
            },
        });
        console.log(res, 'res');
    }

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
          <h2>Status {getShortAddressByAddress(loginUserId || "")}</h2>
            <IonButton onClick={connectWeb3Mq}>install</IonButton>
            <IonButton onClick={testCallSnaps}>testCallSnaps</IonButton>
          <IonCard>
            <h1>Connect to MetaMask Flask</h1>
            <IonButton
              onClick={async () => {
                await present({
                  message: "Connecting...",
                  spinner: "circles",
                });
                await connectToWeb3MQ();
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
