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
} from "@ionic/react";

import ss from "./index.module.scss";
import {
  checkmarkCircleOutline,
  chevronDownOutline,
  searchOutline,
} from "ionicons/icons";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assert/svg/user.svg";
import {
  getAddressByDids,
  getShortAddressByAddress,
} from "../../services/utils/utils";

export enum STARCH_TYPE {
  WALLET = "Wallet",
  DOTBIT = "Dot.Bit",
  ENS = "ENS",
}

const Channels: React.FC = () => {
  const {
    channelList,
    setActiveChannel,
    activeChannel,
    setShowLoading,
    searchUsers,
    setSearchUsers,
  } = useStore();
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
      ///avatar_url
      // :
      // ""
      // nickname
      // :
      // ""
      // userid
      // :
      // "user:183e1038a8d2375b375fa9cf2e27597df275876537b1d569f857099a2061c024"
      // wallet_address
      // :
      // "0x3797e4c0cf73207c0ef766678ad41e1abbc5c08c"
      // wallet_type
      // :
      // "eth"
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
            setShowLoading(true);
            setActiveChannel(topic);
            await getMessages(true, topic);
            setShowLoading(false);
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
    [activeChannel, getMessages, setActiveChannel, setShowLoading]
  );

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
            setShowLoading(true);
            await creatRoom(false, roomName);
            setShowLoading(false);
          }}
        >
          Create Channel
        </IonButton>
        <IonButton
          onClick={async () => {
            setShowLoading(true);
            await getChannelList(true);
            setShowLoading(false);
          }}
        >
          Get Channel List
        </IonButton>
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
                setShowLoading(true);
                if (searchType !== STARCH_TYPE.WALLET) {
                  address = await getAddressByDids(
                    searchType,
                    readySendMessage
                  );
                }
                console.log(address, "address");
                const users = await getUserId(address);
                setSearchUsers(users);
                setShowLoading(false);
                console.log(users, "users");
              }}
            />
          </div>
          {/*<IonButton*/}
          {/*  className={ss.oneButton}*/}
          {/*  onClick={async () => {*/}
          {/*    console.log("1v1 room");*/}
          {/*    // setShowLoading(true);*/}
          {/*    // await getChannelList(true);*/}
          {/*    // setShowLoading(false);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Search Users*/}
          {/*</IonButton>*/}
        </div>
        <h3>Results</h3>

        <IonList>
          {searchUsers &&
            searchUsers.length > 0 &&
            searchUsers.map((item, index) => (
              <RenderChannelItem key={index} channel={item} isUser={true} />
            ))}
        </IonList>
        <IonList>
          {channelList &&
            channelList.length > 0 &&
            channelList.map((item, index) => (
              <RenderChannelItem key={index} channel={item} />
            ))}
        </IonList>
      </IonCard>
    </div>
  );
};
export default observer(Channels);
