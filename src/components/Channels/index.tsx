import React, { useCallback, useState } from "react";

import {
  IonAvatar,
  IonButton,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import ss from "./index.module.scss";
import {
  checkmarkCircleOutline,
  chevronDownOutline,
  paw,
  searchOutline,
} from "ionicons/icons";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assets/svg/user.svg";
import {
  getAddressByDids,
  getShortAddressByAddress,
} from "../../services/utils/utils";
import copy from "copy-to-clipboard";

export enum STARCH_TYPE {
  WALLET = "Wallet",
  DOTBIT = "Dot.Bit",
  ENS = "ENS",
}

const Channels: React.FC = () => {
  const {
    channelList,
    setActiveChannel,
    setActiveChannelItem,
    setActiveUser,
    activeChannel,
    searchUsers,
    setSearchUsers,
  } = useStore();
  const [present, dismiss] = useIonLoading();
  const [presentToast] = useIonToast();
  const { getChannelList, creatRoom, getMessages, getUserId } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [searchType, setSearchType] = useState<STARCH_TYPE>(STARCH_TYPE.WALLET);

  const searchTypes: STARCH_TYPE[] = [
    STARCH_TYPE.WALLET,
    STARCH_TYPE.DOTBIT,
    STARCH_TYPE.ENS,
  ];

  const RenderChannelItem = useCallback(
    (props: { channel: any; isUser?: boolean }) => {
      const { channel, isUser = false } = props;
      let topic = "",
        avatar = userIcon,
        chatName = "";
      if (isUser) {
        topic = channel.userid;
        chatName = channel.nickname ? channel.nickname : channel.userid;
        avatar = channel.avatar_url ? channel.avatar_url : userIcon;
      } else {
        topic = channel.topic;
        chatName = channel.chat_name ? channel.chat_name : topic;
        avatar = channel.avatar_url ? channel.avatar_url : userIcon;
      }

      return (
        <IonItem
          className={ss.chatListItem}
          onClick={async () => {
            await present({
              message: "Loading...",
            });
            setActiveChannel(topic);
            if (isUser) {
              setActiveUser(channel);
            } else {
              setActiveChannelItem(channel);
            }
            await getMessages(true, topic);
            await dismiss();
          }}
        >
          <IonAvatar slot="start" className={ss.messageListAvatar}>
            <img src={avatar} alt="" />
          </IonAvatar>
          <IonLabel className={ss.messageBody}>
            <p className={ss.upText}>{chatName}</p>
            <p className={ss.downText}>{topic}</p>
          </IonLabel>
          <IonLabel slot="end" className={ss.messageBody}>
            {activeChannel === topic && (
              <div className={ss.unReadCount}>
                <IonIcon
                  style={{ color: "#4b7ef7", fontSize: "24px" }}
                  slot="icon-only"
                  icon={checkmarkCircleOutline}
                />
              </div>
            )}
          </IonLabel>
        </IonItem>
      );
    },
    [activeChannel, dismiss, getMessages, present, setActiveChannel, setActiveChannelItem, setActiveUser]
  );

  const handleGetChannelList = async () => {
    await present({ message: "Loading..." });
    const res = await getChannelList(true);
    await dismiss();
  }

  return (
    <div className={ss.ionCard}>
      <IonCard className={ss.box}>
        <h2>Selected Channel : {getShortAddressByAddress(activeChannel)} </h2>
        <IonInput
          className={ss.messageInput}
          value={roomName}
          placeholder="Enter a channel name"
          onIonChange={(e) => {
            setRoomName(e.detail.value!);
          }}
        />
        <IonButton
          onClick={async () => {
            await present({ message: "Loading..." });
            await creatRoom(false, roomName);
            setRoomName("");
            await dismiss();
          }}
        >
          Create Channel
        </IonButton>
        <IonButton
          onClick={handleGetChannelList}
        >
          Get Channel List
        </IonButton>
        {channelList && channelList.length > 0 && (
          <>
            <h3>Channel List</h3>
            <IonList>
              {channelList.map((item, index) => (
                <RenderChannelItem key={index} channel={item} />
              ))}
            </IonList>
          </>
        )}
        <h3>Search user to chat</h3>
        <div className={ss.oneChatBox}>
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
                    <li
                      key={index}
                      onClick={() => {
                        setSearchType(item);
                      }}
                    >
                      {item}
                    </li>
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
            <IonIcon
              className={ss.searchButton}
              slot="icon-only"
              icon={searchOutline}
              onClick={async () => {
                console.log(readySendMessage, "readySendMessage");
                let address = readySendMessage;
                await present({ message: "Loading..." });
                if (searchType !== STARCH_TYPE.WALLET) {
                  address = await getAddressByDids(
                    searchType,
                    readySendMessage
                  );
                }
                console.log(address, "address");
                await getUserId(address);
                await dismiss();
              }}
            />
          </div>
        </div>
        {searchUsers && (
          <>
            {searchUsers.length == 0 && (
              <div className={ss.emptyUserText}>
                <div className={ss.top}>
                  This address/did is not on Web3MQ yet, invite them to join
                  with
                </div>
                <a
                  className={ss.bottom}
                  onClick={() => {
                    copy("https://web3mq-snap-demo.pages.dev");
                    presentToast({
                      message: "Copied!",
                      duration: 3000,
                      position: "middle",
                    }).then();
                  }}
                >
                  {`"Chat with ${readySendMessage}"`}
                  <div className={ss.copyTopic}>
                    <IonButton
                      className={ss.oneButton}
                      onClick={async () => {
                        copy("https://web3mq-snap-demo.pages.dev");
                        await presentToast({
                          message: "Copied!",
                          duration: 3000,
                          position: "middle",
                        });
                      }}
                    >
                      Copy to clipboard
                    </IonButton>
                  </div>
                </a>
              </div>
            )}

            {searchUsers.length > 0 && (
              <>
                <h3>Users</h3>
                <IonList>
                  {searchUsers.map((item, index) => (
                    <RenderChannelItem
                      key={index}
                      channel={item}
                      isUser={true}
                    />
                  ))}
                </IonList>
              </>
            )}
          </>
        )}
      </IonCard>
    </div>
  );
};
export default observer(Channels);
