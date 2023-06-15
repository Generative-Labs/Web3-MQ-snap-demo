import React, { useCallback, useMemo, useState } from "react";

import {
  IonAvatar,
  IonButton,
  IonCard,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import ss from "./index.module.scss";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assets/svg/user.svg";
import { ContactListItemType } from "../../services/snap/dto";
import {
  getShortAddressByAddress,
  getUserAvatar,
} from "../../services/utils/utils";

enum UsersTab {
  FOLLOWER = "0",
  FOLLOWING = "1",
  CONTACTS = "2",
  FRIEND_REQUEST_LIST = "3",
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
          className={ss.chatListItem}
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
          <IonAvatar slot="start" className={ss.messageListAvatar}>
            <img src={avatar} alt="" />
          </IonAvatar>
          <IonLabel className={ss.messageBody}>
            <p className={ss.upText}>{nickname}</p>
            <p className={ss.downText}>{user.userid}</p>
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

  return (
    <div className={ss.ionCard}>
      <IonCard className={ss.box}>
        <h2>Contacts List </h2>
        <IonButton onClick={handleGetList}>Get Contacts List</IonButton>

        <div className={ss.tabs}>
          <IonSegment
            value={segmentValue}
            onIonChange={(e: any) => {
              setSegmentValue(e.detail.value);
            }}
          >
            <IonSegmentButton value={UsersTab.FOLLOWER}>
              <IonLabel>Follower</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={UsersTab.FOLLOWING}>
              <IonLabel>Following</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={UsersTab.CONTACTS}>
              <IonLabel>contacts</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={UsersTab.FRIEND_REQUEST_LIST}>
              <IonLabel>Friend request list</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <div>
            <IonList>
              {datList.map((item, index) => (
                <RenderChannelItem key={index} user={item} />
              ))}
            </IonList>
          </div>
        </div>
      </IonCard>
    </div>
  );
};
export default observer(Contacts);
