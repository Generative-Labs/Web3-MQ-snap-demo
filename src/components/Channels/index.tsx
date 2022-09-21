import React, {useCallback, useState} from "react";

import {
    IonAvatar,
    IonButton,
    IonCard,
    IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";

import ss from "./index.module.scss";
import { checkmarkCircleOutline } from "ionicons/icons";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assert/svg/user.svg";

const Channels: React.FC = () => {
  const { channelList, setActiveChannel, activeChannel, setShowLoading } = useStore();
  const { getChannelList, creatRoom,getMessages } = useSnaps();
    const [readySendMessage, setReadySendMessage] = useState("");

  const RenderChannelItem = useCallback((props: { channel: any }) => {
    const { channel } = props;
    return (
      <IonItem
        className={ss.chatListItem}
        onClick={async () => {
          setShowLoading(true)
          setActiveChannel(channel.topic);
          await getMessages(true, channel.topic)
          setShowLoading(false)
        }}
      >
        <IonAvatar slot="start" className={ss.messageListAvatar}>
          <img
            src={channel.avatar_url ? channel.avatar_url : userIcon}
            alt=""
          />
        </IonAvatar>
        <IonLabel className={ss.messageBody}>
          <p className={ss.upText}>{channel.chat_name}</p>
          <p className={ss.downText}>{channel.topic}</p>
        </IonLabel>
        <IonLabel slot="end" className={ss.messageBody}>
          {activeChannel === channel.topic && (
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
  }, [activeChannel, channelList]);

  return (
    <IonCard className={ss.box}>
        {/*<IonInput*/}
        {/*    className={ss.messageInput}*/}
        {/*    value={readySendMessage}*/}
        {/*    placeholder="Enter a channel name"*/}
        {/*    onIonChange={(e) => {*/}
        {/*        setReadySendMessage(e.detail.value!);*/}
        {/*    }}*/}
        {/*/>*/}
      <IonButton
          onClick={async () => {
            setShowLoading(true)
            await creatRoom(false, readySendMessage);
            setShowLoading(false)
          }}
      >
        Create Channel
      </IonButton>
      <IonButton
        onClick={async () => {
          setShowLoading(true)
          await getChannelList(true);
          setShowLoading(false)
        }}
      >
        Get Channel List
      </IonButton>
      <IonList>
        {channelList &&
          channelList.length > 0 &&
          channelList.map((item, index) => (
            <RenderChannelItem key={index} channel={item} />
          ))}
      </IonList>
    </IonCard>
  );
};
export default observer(Channels);
