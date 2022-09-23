import React, { useEffect, useState } from "react";

import { IonAlert, IonButton, IonCard, IonLoading } from "@ionic/react";

import ss from "./index.module.scss";
import cx from "classnames";
import { useDebounceFn } from "ahooks";
import { sendMessageBySnaps } from "../services/utils/snaps";
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

const Home: React.FC = () => {
  const store = useStore();
  const {
    isConnected,
    setShowLoading,
    showLoading,
    activeChannel,
    loginUserId,
    showAlert,
    setShowAlert,
    errorMessage,
    setErrorMessage,
    setLoginUserId,
  } = store;
  const { register, creatRoom, connectWeb3Mq, getMessages, getChannelList } =
    useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");
  const [showRows, setShowRows] = useState(
    window.innerWidth <= 800
      ? 1
      : window.innerWidth > 800 && window.innerWidth <= 1500
      ? 2
      : 3
  );

  const { run } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      if (!isConnected) {
        await connectWeb3Mq();
      }
      if (!activeChannel) {
        alert("Please Choose Channel");
        return false;
      }
      await sendMessageBySnaps(readySendMessage, activeChannel).catch((e) => {
        console.log(e, "sendMessage error");
        setShowLoading(false);
      });
      setReadySendMessage("");
      await getMessages(true);
      setShowLoading(false);
    },
    {
      wait: 500,
    }
  );

  useEffect(() => {
    const init = async () => {
      if (getKeys()) {
        setLoginUserId(getLoginUserId());
      }
    };
    init();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1500 && window.innerWidth > 800) {
        setShowRows(2);
      } else if (window.innerWidth <= 800) {
        setShowRows(1);
      } else {
        setShowRows(3);
      }
    });
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
                setShowLoading(true);
                await connectWeb3Mq();
                setShowLoading(false);
              }}
              disabled={isConnected}
            >
              {isConnected ? "Connected" : "Connect"}
            </IonButton>
            <h1>Connect to Web3MQ network</h1>
            <IonButton
              onClick={async () => {
                setShowLoading(true);
                await connectWeb3Mq();
                setShowLoading(false);
              }}
              disabled={!!getKeys()}
            >
              {getKeys() ? "Registered" : "Register And Login"}
            </IonButton>
          </IonCard>
        </div>
        <Channels />
        <MobileDemo />
        <SendNotify />
      </div>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => {
          setShowLoading(false);
        }}
        message={"Loading"}
      />
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
