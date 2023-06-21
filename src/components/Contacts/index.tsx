import React, { useCallback, useMemo, useState } from "react";

import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assets/svg/user.svg";
import { ContactListItemType } from "../../services/snap/dto";
import {
  getShortAddressByAddress,
  getUserAvatar,
} from "../../services/utils/utils";
import { Button } from "../Button";
import "./index.scss";

enum UsersTab {
  FOLLOWER = 0,
  FOLLOWING,
  CONTACTS,
  FRIEND_REQUEST_LIST,
}

const Contacts: React.FC = () => {
  const {
    contactsList,
    followingList,
    followerList,
    friendRequestList,
    setActiveChannel,
    setActiveUser,
  } = useStore();
  const [present, dismiss] = useIonLoading();
  const [presentToast] = useIonToast();
  const [segmentValue, setSegmentValue] = useState<UsersTab>(UsersTab.FOLLOWER);
  const {
    getContactList,
    getFollowerList,
    getFollowingList,
    getMyFriendRequestList,
    getMessages,
  } = useSnaps();
  const handleGetList = async () => {
    await present({ message: "Loading..." });
    await getContactList({ page: 1, size: 30 });
    await getFollowerList({ page: 1, size: 30 });
    await getFollowingList({ page: 1, size: 30 });
    await getMyFriendRequestList({ page: 1, size: 30 });
    await dismiss();
  };
  const RenderChannelItem = useCallback(
    (props: { user: ContactListItemType }) => {
      const { user } = props;
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
    },
    []
  );
  const datList = useMemo(() => {
    switch (segmentValue) {
      case UsersTab.CONTACTS:
        return contactsList;
      case UsersTab.FOLLOWER:
        return followerList;
      case UsersTab.FOLLOWING:
        return followingList;
      case UsersTab.FRIEND_REQUEST_LIST:
        return friendRequestList;
    }
  }, [
    segmentValue,
    contactsList,
    followerList,
    followingList,
    friendRequestList,
  ]);
  if (datList.length <= 0) {
    return <div className="contactsPanel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '12px', width: '100%'}}>
        <Button className={'getContactsListBtn'} onClick={handleGetList} title="Get Contacts List" />
        <div style={{ textAlign: 'center' }} className={'emptyContactsText'}>
          Please click the button for the contact list
        </div>
      </div>
    </div>
  }

  return (
    <div className="contactsPanel">
      <div className="contactTabs">
        {["Followers", "Following", "Contacts"].map((title, index) => (
          <div
            className={`tab ${index === segmentValue  ? 'active': ''}`}
            key={title}
            onClick={() => setSegmentValue(index)}
          >
            {title}
          </div>
        ))}
        {/* <IonLabel>Friend request list</IonLabel> */}
      </div>
      <div style={{ maxHeight: "625px", overflowY: "auto", width: '100%' }}>
        <IonList>
          {datList.map((item, index) => (
            <RenderChannelItem key={index} user={item} />
          ))}
        </IonList>
      </div>
    </div>
  );
};
export default observer(Contacts);
