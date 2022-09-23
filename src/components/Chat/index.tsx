import React, { useState } from "react";

import { IonButton, IonCard, IonIcon, IonInput } from "@ionic/react";

import ss from "./index.module.scss";
import { useDebounceFn } from "ahooks";
import { sendNotifyMessage } from "../../services/utils/snaps";
import {chevronDownOutline, reloadOutline, searchOutline} from "ionicons/icons";

const Chat: React.FC = () => {
  const [readySendMessage, setReadySendMessage] = useState("");
  const [searchType, setSearchType] = useState("Wallet");
  const searchTypes = ["Wallet", "Dot.Bit", "ENS"];

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
  return (
    <div className={ss.ionCard}>
      <IonCard className={ss.box}>
        <h1>1v1 Chat</h1>
        <div className={ss.searchUserBox}>
          <div className={ss.searchTypeBox}>
            <div className={ss.searchType}>
              {searchType}
              <IonIcon
                  style={{ color: "#000", fontSize: "14px" }}
                  slot="icon-only"
                  icon={chevronDownOutline}
              />
            </div>
            <div className={ss.selectSearchType}>
              <ul>
                {searchTypes.map((item, index) => (
                  <li key={index} onClick={() => {
                    setSearchType(item)
                  }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <IonInput
            className={ss.input}
            value={readySendMessage}
            placeholder="Write a message"
            onIonChange={(e) => {
              setReadySendMessage(e.detail.value!);
            }}
          />
          <IonButton
            className={ss.searchButton}
            onClick={() => {
              console.log("search user");
              // localStorage.clear();
              // let href = window.location.href;
              // window.location.href = href;
            }}
          >
            <IonIcon
              style={{ color: "#000", fontSize: "24px" }}
              slot="icon-only"
              icon={searchOutline}
            />
          </IonButton>
        </div>
        <div>
          <IonInput
            className={ss.messageInput}
            value={readySendMessage}
            placeholder="Write a message"
            onIonChange={(e) => {
              setReadySendMessage(e.detail.value!);
            }}
          />
        </div>
        <IonButton onClick={run} disabled={!readySendMessage}>
          sendMessage
        </IonButton>
      </IonCard>
    </div>
  );
};
export default Chat;
