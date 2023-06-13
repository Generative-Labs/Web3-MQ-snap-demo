import React, { useCallback, useState } from "react";

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
  useIonLoading,
} from "@ionic/react";

import ss from "./index.module.scss";
import { useDebounceFn } from "ahooks";
import { cloudDownloadOutline, reloadOutline, send } from "ionicons/icons";
import { sendMessageBySnaps } from "../../services/utils/snaps";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import moment from "moment";
import {
  getGroupName,
  getShortAddressByAddress,
  getUserName,
} from "../../services/utils/utils";

const userIcon = require("../../assets/svg/user.svg").default;
const MobileDemo: React.FC = () => {
  const store = useStore();
  const [present, dismiss] = useIonLoading();
  const {
    messageList,
    isConnected,
    activeChannel,
    activeChannelItem,
    activeUser,
  } = store;
  const { connectWeb3Mq, getMessages } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");

  const { run } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      await present({ message: "Loading..." });
      if (!activeChannel) {
        alert("Please Choose Channel");
        return false;
      }
      await sendMessageBySnaps(readySendMessage, activeChannel).catch((e) => {
        console.log(e, "sendMessage error");
      });
      await getMessages(true, activeChannel);
      setReadySendMessage("");
      await dismiss();
    },
    {
      wait: 500,
    }
  );

  const RenderMessageAvatar = useCallback((props: { message: any }) => {
    const { message } = props;
    return (
      <div className={ss.userTitleBox}>
        <div className={ss.userInfoBox}>
          <img src={userIcon} alt="" />
          <div className={ss.username}>
            {getShortAddressByAddress(message.senderId)}
          </div>
          {message.created_at > 0 && (
            <div className={ss.createAt}>
              {moment
                .utc(message.created_at / 1000000)
                .local()
                .format("MM/DD HH:mm")}
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  const RenderMessage = useCallback((props: { message: any }) => {
    const { message } = props;
    return (
      <div
        className={ss.messageContentsText}
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    );
  }, []);

  return (
    <div className={ss.ionCard}>
      <IonCard className={ss.demoPage}>
        <h2>Web3 MQ Demo</h2>
        <IonHeader
          style={{
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                className="settingIcon"
                onClick={async () => {
                  if (activeChannel) {
                    await present({ message: "Loading..." });
                    await getMessages();
                    await dismiss();
                  }
                }}
              >
                <IonIcon
                  style={{ color: "#000", fontSize: "24px" }}
                  slot="icon-only"
                  icon={cloudDownloadOutline}
                />
              </IonButton>
            </IonButtons>
            <IonTitle>
              {activeChannel
                ? activeUser
                  ? `Chat With ${getUserName(activeUser)}`
                  : getGroupName(activeChannelItem)
                : "Web3 MQ Demo"}
            </IonTitle>
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
          <div className={ss.messagesContent}>
            {messageList &&
              messageList.length > 0 &&
              messageList.map((message, index) => (
                <div className={ss.messageBox} key={index}>
                  <RenderMessageAvatar message={message} />
                  <div className={ss.messageBodyContentBox}>
                    <RenderMessage message={message} />
                  </div>
                </div>
              ))}
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

        {!activeChannel && (
          <div className={ss.demoNoLogin}>
            <div>
              <h1>
                Before using it, please click to get channel list and choose one
                to chat with
              </h1>
            </div>
          </div>
        )}
      </IonCard>
    </div>
  );
};
export default observer(MobileDemo);
