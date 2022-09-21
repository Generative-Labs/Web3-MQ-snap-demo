import React, { useState } from "react";

import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import ss from "./index.module.scss";
import { useDebounceFn } from "ahooks";
import { reloadOutline, send } from "ionicons/icons";
import { sendMessageBySnaps } from "../../services/utils/snaps";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";

const MobileDemo: React.FC = () => {
  const store = useStore();
  const { messageList, isConnected, setShowLoading, activeChannel } = store;
  const { connectWeb3Mq, getMessages } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");

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
      });
      setReadySendMessage("");
      await getMessages(true, activeChannel);
    },
    {
      wait: 500,
    }
  );

  return (
    <IonCard className={ss.demoPage}>
      <IonHeader
        style={{
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <IonToolbar>
          <IonTitle>Web3 MQ Demo</IonTitle>
          <IonButtons slot="end">
            <IonButton
              className="settingIcon"
              onClick={() => {
                localStorage.clear();
                let href = window.location.href;
                window.location.href = href;
              }}
            >
              <IonIcon
                style={{ color: "#000", fontSize: "24px" }}
                slot="icon-only"
                icon={reloadOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={ss.demoContent}>
        <div className={ss.messageBox}>
          <ul>
            {messageList.map((item, index) => (
              <li key={index}>{item.content} </li>
            ))}
          </ul>
        </div>
      </IonContent>
      <IonFooter className={ss.footer}>
        <IonInput
          className={ss.messageInput}
          value={readySendMessage}
          placeholder="Write a message"
          onIonChange={(e) => {
            setReadySendMessage(e.detail.value!);
          }}
          onKeyDown={async (e) => {
            if (e.keyCode === 13) {
              run();
            }
          }}
        />
        <IonButton onClick={run}>
          <IonIcon
            style={{ color: "#fff", fontSize: "24px" }}
            slot="icon-only"
            icon={send}
          />
        </IonButton>
      </IonFooter>

      {(!isConnected || !activeChannel) && (
        <div className={ss.demoNoLogin}>
          <div>
            <h1>
              Before using it, please click to get channel list and choose one
              to chat with
            </h1>
            {!isConnected && (
              <IonButton
                onClick={async () => {
                  setShowLoading(true);
                  await connectWeb3Mq();
                  setShowLoading(false);
                }}
                className={ss.button}
              >
                Connect
              </IonButton>
            )}
          </div>
        </div>
      )}
    </IonCard>
  );
};
export default observer(MobileDemo);
