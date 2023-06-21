import React, { useCallback, useState } from "react";

import {
  IonButton,
  IonButtons,
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
import { cloudDownloadOutline, reloadOutline } from "ionicons/icons";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import moment from "moment";
import {
  getGroupName,
  getShortAddressByAddress,
  getUserName,
} from "../../services/utils/utils";
import { useSnapClient } from "../../hooks/useSnapClient";
import { RefreshIcon, SendIcon, SyncIcon, TipIcon } from "../../icons";
import web3MqLogo from "../../assets/web3mq.logo.png";

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
  const { getMessages } = useSnaps();
  const { snapClient } = useSnapClient();
  const [readySendMessage, setReadySendMessage] = useState("");

  const { run } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      await present({ message: "Loading..." });
      if (!activeChannel) {
        alert("Please Choose Channel");
        return false;
      }
      console.log(activeChannel, "activeChannel");
      await snapClient
        .sendMessage({
          msg: readySendMessage,
          topic: activeChannel,
        })
        .catch((e) => {
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
    <div className={ss.mobilePannel}>
      <header className={ss.header}>
        <SyncIcon
          className={ss.pointer}
          onClick={async () => {
            if (activeChannel) {
              await present({ message: "Loading..." });
              await getMessages();
              await dismiss();
            }
          }}
        />
        <div className={ss.chatTitle}>
          <img src={web3MqLogo} alt="" width={16} />
          <div className={ss.title}>
            {activeChannel
              ? activeUser
                ? `Chat With ${getUserName(activeUser)}`
                : getGroupName(activeChannelItem)
              : "Web3 MQ Demo"}
          </div>
        </div>
        <RefreshIcon
          className={ss.pointer}
          onClick={() => {
            localStorage.clear();
            let href = window.location.href;
            window.location.href = href;
          }}
        />
      </header>
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
          placeholder="Send a Message"
          onIonChange={(e) => {
            setReadySendMessage(e.detail.value!);
          }}
          onKeyDown={async (e) => {
            if (e.keyCode === 13) {
              run();
            }
          }}
        />
        {activeChannel && (
          <SendIcon style={{ color: "#663CEE" }} onClick={run} />
        )}
        {!activeChannel && <SendIcon />}

        {/* <IonButton onClick={run}>
          </IonButton> */}
      </IonFooter>

      {!activeChannel && (
        <div className={ss.notLoginMask}>
          <div className={ss.content}>
            <TipIcon className={ss.largeTip} />
            <div className={ss.tip}>
              Before using it, please click to get channel list and choose one
              to chat with
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default observer(MobileDemo);
