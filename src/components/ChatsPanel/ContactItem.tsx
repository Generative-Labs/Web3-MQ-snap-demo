import React from "react";
import {
  IonAvatar,
  IonItem,
  IonLabel,
  useIonLoading
} from "@ionic/react";
import { useSnaps } from "../../hooks/useSnaps";
import { observer } from "mobx-react";
import { getShortAddressByAddress, getUserAvatar } from "../../services/utils/utils";
import { ContactListItemType } from "../../services/snap/dto";
import userIcon from "../../assets/svg/user.svg";
import { useStore } from "../../services/mobx/service";

interface IRenderChannelItem {
  key: string | number;
  user: ContactListItemType;
}
const ContactItem = (props: IRenderChannelItem) => {
  const { user, key } = props;
  const [present, dismiss] = useIonLoading();
  const {
    setActiveChannel, setActiveUser,
  } = useStore();
  const {
    getMessages,
  } = useSnaps();
  const topic = user.follow_status === "follow_each" ? user.userid : "";
  const nickname = user.nickname
    ? user.nickname
    : user.wallet_address
      ? getShortAddressByAddress(user.wallet_address)
      : user.userid
        ? getShortAddressByAddress(user.userid, 10, 6)
        : "-";
  const avatar = user.avatar_url
    ? user.avatar_url
    : getUserAvatar(user.wallet_address || user.userid) || userIcon;

  return (
    <IonItem
      key={key}
      className="chatListItem"
      onClick={async () => {
        if (user.follow_status === "follow_each") {
          await present({
            message: "Loading...",
          });
          setActiveChannel(topic);
          setActiveUser(user);
          await getMessages(true, topic);
          await dismiss();
        }
      }}
    >
      <IonAvatar slot="start" className="messageListAvatar">
        <img src={avatar} alt="" />
      </IonAvatar>
      <IonLabel className="messageBody">
        <p className="upText">{nickname}</p>
        <p className="downText">{user.userid}</p>
      </IonLabel>
    </IonItem>
  );
};


export default observer(ContactItem);