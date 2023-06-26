import { useCallback } from "react";
import { useIonLoading } from "@ionic/react";
import { ChannelItemType } from "../../../services/snap/dto";
import userIcon from "../../../assets/svg/user.svg";
import channelIcon from "../../../assets/svg/channel.svg";
import { useStore } from "../../../services/mobx/service";
import { useSnaps } from "../../../hooks/useSnaps";
import { observer } from "mobx-react";

interface IRenderChannelItem {
  channel: ChannelItemType | any;
  isUser?: boolean;
}
const _Item = ({ channel, isUser = false }: IRenderChannelItem) => {
  const [present, dismiss] = useIonLoading();
  const { getMessages } = useSnaps();
  const {
    setActiveChannel, setActiveChannelItem, setActiveUser,
  } = useStore();
  let topic = "", avatar = userIcon, chatName = "";
  topic = channel.topic;
  chatName = channel.chat_name ? channel.chat_name : topic;
  avatar = channel.avatar_url ? channel.avatar_url : channelIcon;
  if (channel.chat_type === 'user') {
    avatar = channel.avatar_url ? channel.avatar_url : userIcon;
  }

  const onChannelClick = useCallback(async () => {
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
  }, [channel, dismiss, getMessages, isUser, present, setActiveChannel, setActiveChannelItem, setActiveUser, topic]);
  return (
    <div
      className="mq-channel-item"
      onClick={onChannelClick}
    >
      <img src={avatar} className="avatar" alt="" />
      <div className="info">
        <div className="nickname">{chatName}</div>
        <div className="address">{topic}</div>
      </div>
    </div>
  );
};
export const Item = observer(_Item);
