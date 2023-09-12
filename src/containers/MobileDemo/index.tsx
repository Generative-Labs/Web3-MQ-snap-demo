import React, { useCallback, useMemo, useState } from "react";

import {
  IonContent,
  IonFooter,
  IonInput,
  useIonLoading,
} from "@ionic/react";

import ss from "./index.module.scss";
import { useDebounceFn } from "ahooks";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import {
  getGroupName,
  getShortAddressByAddress,
  getUserName,
} from "../../services/utils/utils";
import { useSnapClient } from "../../hooks/useSnapClient";
import { RefreshIcon, SendIcon, TipIcon } from "../../icons";
import web3MqLogo from "../../assets/web3mq.logo.png";

type MessageOfMq = {
  _id: number
  id: number
  content: string
  senderId: string
  username: string
  avatar: string
  date: string
  timestamp: string
  system: boolean
  saved: boolean
  distributed: boolean
  seen: boolean
  failure: boolean
}

const userIcon = require("../../assets/svg/user.svg").default;
const MobileDemo: React.FC = () => {
  const store = useStore();
  const [present, dismiss] = useIonLoading();
  const {
    messageList,
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
      try {
        await present({ message: "Loading..." });
        if (!activeChannel) {
          alert("Please Choose Channel");
          return false;
        }
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
      } finally {
        await dismiss();
      }
    },
    {
      wait: 500,
    }
  );

  const RenderMessageAvatar = useCallback((props: { message: MessageOfMq }) => {
    const { message } = props;
    // const nickname = useMemo(() => {
    //   if (user.nickname) {
    //     return user.nickname
    //   }
    //   if (user.wallet_address) {
    //     return getShortAddressByAddress(user.wallet_address)
    //   }
    //   if (user.userid) {
    //     return getShortAddressByAddress(user.userid, 10, 6)
    //   }
    //   return '-'
    // }, [user.nickname, user.userid, user.wallet_address]);
    return (
      <div className={ss.userTitleBox}>
        <div className={ss.userInfoBox}>
          <img src={userIcon} alt="" />
          <div className={ss.username}>
            {getShortAddressByAddress(message.senderId)}
          </div>
          {/* {message.created_at > 0 && (
            <div className={ss.createAt}>
              {moment
                .utc(message.created_at / 1000000)
                .local()
                .format("MM/DD HH:mm")}
            </div>
          )} */}
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

  const pullMessage = useCallback(async () => {
    if (activeChannel) {
      try {
        await present({ message: "Loading..." });
        await getMessages();
      } finally {
        await dismiss();
      }
    }
  }, [activeChannel, dismiss, getMessages, present])

  return (
    <div className={ss.mobilePannel}>
      <header className={ss.header}>
        <div className={ss.chatTitle}>
          <img src={web3MqLogo} alt="" width={16} />
          <div className={ss.title}>
            {activeChannel
              ? activeUser
                ? `Chat With ${getUserName(activeUser)}`
                : getGroupName(activeChannelItem)
              : "Web3MQ Demo"}
          </div>
        </div>
        <div className={ss.refresh} onClick={pullMessage}>
          <div className={ss.refreshTitle}>Pull messages</div>
          <RefreshIcon />
        </div>
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
          <SendIcon style={{ color: "#663CEE", cursor: 'pointer' }} onClick={run} />
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
