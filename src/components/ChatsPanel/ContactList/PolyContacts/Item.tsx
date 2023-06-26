import { useCallback, useMemo } from "react";
import {
  IonAvatar,
  IonItem,
  IonLabel,
  useIonLoading
} from "@ionic/react";
import { useSnaps } from "../../../../hooks/useSnaps";
import { observer } from "mobx-react";
import { getShortAddressByAddress, getUserAvatar } from "../../../../services/utils/utils";
import { ContactListItemType } from "../../../../services/snap/dto";
import userIcon from "../../../../assets/svg/user.svg";
import { useStore } from "../../../../services/mobx/service";

import './Item.scss';
import { Button } from "../../../Button";

const buttonTitleMap = {
  following: 'Following',
  follower: 'Follower',
  follow_each: 'Private Message',
}

interface IRenderChannelItem {
  user: ContactListItemType;
}
const Item = (props: IRenderChannelItem) => {
  const { user } = props;
  const [present, dismiss] = useIonLoading();
  const {
    setActiveChannel, setActiveUser,
  } = useStore();
  const {
    getMessages,
  } = useSnaps();
  const topic = user.follow_status === "follow_each" ? user.userid : "";
  const nickname = useMemo(() => {
    if (user.nickname) {
      return user.nickname
    }
    if (user.wallet_address) {
      return getShortAddressByAddress(user.wallet_address)
    }
    if (user.userid) {
      return getShortAddressByAddress(user.userid, 10, 6)
    }
    return '-'
  }, [user.nickname, user.userid, user.wallet_address]);

  const avatar = useMemo(() => {
    if (user.avatar_url) {
      return user.avatar_url
    }
    return getUserAvatar(user.wallet_address || user.userid) || userIcon
  }, [user.avatar_url, user.userid, user.wallet_address])

  const onContactClick = useCallback(async () => {
    if (user.follow_status === "follow_each") {
      await present({
        message: "Loading...",
      });
      setActiveChannel(topic);
      setActiveUser(user);
      await getMessages(true, topic);
      await dismiss();
    }
  }, [dismiss, getMessages, present, setActiveChannel, setActiveUser, topic, user])

  function follow() {}
  return (
    <div
      className="mq-contact-item"
      // onClick={onContactClick}
    >
      <IonAvatar slot="start" className="avatar">
        <img src={avatar} alt="" />
      </IonAvatar>
      <div className="info">
        <div className="nickname">{nickname}</div>
        <div className="address">{user.wallet_address}</div>
      </div>
      <div className="operator">
        <Button className="opBtn" title={buttonTitleMap[user.follow_status]} onClick={follow}/>
      </div>
    </div>
  );
};


export default observer(Item);