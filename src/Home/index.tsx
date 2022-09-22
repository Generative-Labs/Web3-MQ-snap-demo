import React, { useEffect, useState } from "react";

import {
  IonButton,
  IonCard,
  IonLoading,
} from "@ionic/react";

import ss from "./index.module.scss";
import cx from "classnames";
import { useDebounceFn } from "ahooks";
import { sendMessageBySnaps } from "../services/utils/snaps";
import { getKeys, getShortAddressByAddress } from "../services/utils/utils";
import SendNotify from "../components/SendNotify";
import { useStore } from "../services/mobx/service";
import { observer } from "mobx-react";
import MobileDemo from "../components/MobileDemo";
import { useSnaps } from "../hooks/useSnaps";
import Channels from "../components/Channels";
import Messages from "../components/Messages";

const Home: React.FC = () => {
  const store = useStore();
  const {
    isConnected,
    setShowLoading,
    showLoading,
    activeChannel,
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
      <div className={cx(ss.content,  {
          [ss.twoContentRow]: showRows === 2,
          [ss.oneContentRow]: showRows === 1,
      })}>
        <div
          className={cx(ss.ionCard, {
            [ss.twoRow]: showRows === 2,
            [ss.oneRow]: showRows === 1,
          })}
        >
          <h2>Status </h2>
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
                await register(true);
                setShowLoading(false);
              }}
              disabled={!!getKeys()}
            >
              {getKeys() ? "Registered" : "Register And Login"}
            </IonButton>
          </IonCard>
        </div>

        <div
          className={cx(ss.ionCard, {
            [ss.twoRow]: showRows === 2,
            [ss.oneRow]: showRows === 1,
          })}
        >
          <h2>Selected Channel : {getShortAddressByAddress(activeChannel)} </h2>
          <Channels />
        </div>
        <div
          className={cx(ss.ionCard, {
            [ss.twoRow]: showRows === 2,
            [ss.oneRow]: showRows === 1,
          })}
        >
          <h2>Demo</h2>
          <MobileDemo />
        </div>
        {/*<div*/}
        {/*  className={cx(ss.ionCard, {*/}
        {/*    [ss.twoRow]: showRows === 2,*/}
        {/*    [ss.oneRow]: showRows === 1,*/}
        {/*  })}*/}
        {/*>*/}
        {/*  <h2>Actions</h2>*/}
        {/*  <IonCard>*/}
        {/*    <div>Step 1: Register and login to get your keys</div>*/}
        {/*    <IonButton*/}
        {/*      onClick={async () => {*/}
        {/*        setShowLoading(true);*/}
        {/*        await register(true);*/}
        {/*        setShowLoading(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      register and login*/}
        {/*    </IonButton>*/}
        {/*    <div>Step 2: Create a chat room</div>*/}
        {/*    <IonButton*/}
        {/*      onClick={async () => {*/}
        {/*        setShowLoading(true);*/}
        {/*        await creatRoom(true);*/}
        {/*        setShowLoading(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      creat room*/}
        {/*    </IonButton>*/}
        {/*    <div>Step 3: Get your channel list</div>*/}
        {/*    <IonButton*/}
        {/*      onClick={async () => {*/}
        {/*        setShowLoading(true);*/}
        {/*        await getChannelList(true);*/}
        {/*        setShowLoading(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      get channel list*/}
        {/*    </IonButton>*/}
        {/*    <div>Step 4: Now! Send your first message</div>*/}
        {/*    <IonButton*/}
        {/*      onClick={async () => {*/}
        {/*        setReadySendMessage("Hello Web3 MQ");*/}
        {/*        if (!isConnected) {*/}
        {/*          setShowLoading(true);*/}
        {/*          await register();*/}
        {/*          setShowLoading(false);*/}
        {/*        }*/}
        {/*        run();*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Send Message*/}
        {/*    </IonButton>*/}
        {/*    <div>Step 5: View Message History</div>*/}
        {/*    <IonButton*/}
        {/*      onClick={async () => {*/}
        {/*        setShowLoading(true);*/}
        {/*        await getMessages(true);*/}
        {/*        setShowLoading(false);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Get messages*/}
        {/*    </IonButton>*/}
        {/*    <br />*/}
        {/*  </IonCard>*/}
        {/*</div>*/}
        <div
          className={cx(ss.ionCard, {
            [ss.twoRow]: showRows === 2,
            [ss.oneRow]: showRows === 1,
          })}
        >
          <SendNotify />
        </div>
        {/*<div*/}
        {/*  className={cx(ss.ionCard, {*/}
        {/*    [ss.twoRow]: showRows === 2,*/}
        {/*    [ss.oneRow]: showRows === 1,*/}
        {/*  })}*/}
        {/*>*/}
        {/*  <Messages />*/}
        {/*</div>*/}
      </div>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => {
          setShowLoading(false);
        }}
        message={"Loading"}
      />
    </div>
  );
};
export default observer(Home);
