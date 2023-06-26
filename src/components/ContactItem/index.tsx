
import { useMemo, useCallback } from "react";
import { observer } from "mobx-react";
import { useIonLoading } from "@ionic/react";
import { useStore } from "../../services/mobx/service";
import { ContactListItemType, SearchContactListItemType } from "../../services/snap/dto";
import { getShortAddressByAddress } from "../../services/utils/utils";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assets/svg/user.svg";
import { ContactOperateButton } from "./ContactOperateButton";

import './index.scss';
interface IRenderContanctItem {
  user: ContactListItemType | SearchContactListItemType;
  onSuccess?: (user: any) => void
}
const ContactItem = (props: IRenderContanctItem) => {
  const { user, onSuccess } = props;
  const [present, dismiss] = useIonLoading();
  const {
    setActiveChannel, setActiveUser,
  } = useStore();
  const {
    getMessages,
  } = useSnaps();
  
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

  // since rpc response avatar_url is not usable. instead of using default avatar
  // const avatar = useMemo(() => {
  //   if (user.avatar_url) {
  //     return user.avatar_url
  //   }
  //   return getUserAvatar(user.wallet_address || user.userid) || userIcon
  // }, [user.avatar_url, user.userid, user.wallet_address])

  const onSendMessage = useCallback(async () => {
    const topic = user.userid;
    await present({
      message: "Loading...",
    });
    setActiveChannel(topic);
    setActiveUser(user);
    await getMessages(true, topic);
    await dismiss();
  }, [dismiss, getMessages, present, setActiveChannel, setActiveUser, user])
  return (
    <div
      className="mq-contact-item"
      onClick={onSendMessage}
    >
      <img className="avatar" src={userIcon} alt="" />
      <div className="info">
        <div className="nickname">{nickname}</div>
        <div className="address">{user.wallet_address}</div>
      </div>
      <div className="operator">
        <ContactOperateButton user={user} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default observer(ContactItem);