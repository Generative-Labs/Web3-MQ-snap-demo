import React, { useState } from "react";

import { IonButton, IonCard, IonInput } from "@ionic/react";

import ss from "./index.module.scss";
import { useDebounceFn } from "ahooks";
import {
  sendNativeNotifyMessage,
  sendNotifyMessage,
} from "../../services/utils/snaps";

const SendNotify: React.FC = () => {
  const [readySendMessage, setReadySendMessage] = useState("");

  const { run } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      await sendNotifyMessage(readySendMessage).catch((e) => {
        console.log(e, "sendMessage error");
      });
      setReadySendMessage("");
    },
    {
      wait: 500,
    }
  );
  const { run: newRun } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      await sendNativeNotifyMessage(readySendMessage).catch((e) => {
        console.log(e, "sendMessage error");
      });
      setReadySendMessage("");
    },
    {
      wait: 500,
    }
  );
  return (
    <div className={ss.ionCard}>
      <IonCard className={ss.box}>
        <h1>Send Notification</h1>
        <IonInput
          className={ss.messageInput}
          value={readySendMessage}
          placeholder="Write a message"
          onIonChange={(e) => {
            setReadySendMessage(e.detail.value!);
          }}
        />
        <IonButton onClick={run} disabled={!readySendMessage}>
          Send Notification In MetaMask
        </IonButton>
        <IonButton onClick={newRun} disabled={!readySendMessage}>
          Send Native Notification In MetaMask
        </IonButton>
      </IonCard>
    </div>
  );
};
export default SendNotify;
