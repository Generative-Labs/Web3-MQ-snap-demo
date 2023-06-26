import React, { useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import { useIonLoading } from "@ionic/react";
import { Button } from "../../../Button";
import { useSnaps } from "../../../../hooks/useSnaps";
import { useStore } from "../../../../services/mobx/service";
import { EmptyList } from "../../../../EmptyList";
import { ContactIcon } from "../../../../icons";
import { List } from "./List";

import "./index.scss";
import { ContactListItemType } from "../../../../services/snap/dto";

interface IBaseContactsProp {
  type: "flower" | "folowing" | "request" | "contacts";
}

function PolyContacts({ type }: IBaseContactsProp) {
  const {
    contactsList,
    followingList,
    followerList,
    friendRequestList,
    setActiveChannel,
    setActiveUser,
  } = useStore();
  const [present, dismiss] = useIonLoading();
  const {
    getContactList,
    getFollowerList,
    getFollowingList,
    getMyFriendRequestList,
    getMessages,
  } = useSnaps();

  const list: ContactListItemType[] = useMemo(() => {
    switch (type) {
      case "flower":
        return followerList;
      case "folowing":
        return followingList;
      case "request":
        return friendRequestList;
      case "contacts":
        return contactsList;
      default:
        return [];
    }
  }, [contactsList, followerList, followingList, friendRequestList, type]);

  const onPullAllContacts = useCallback(async () => {
    await present({ message: "Loading..." });
    const batch = Promise.all([
      getContactList({ page: 1, size: 30 }),
      getFollowerList({ page: 1, size: 30 }),
      getFollowingList({ page: 1, size: 30 }),
      getMyFriendRequestList({ page: 1, size: 30 }),
    ])
    await batch
    await dismiss();
  }, [
    dismiss,
    getContactList,
    getFollowerList,
    getFollowingList,
    getMyFriendRequestList,
    present,
  ]);

  return (
    <div className="mq-baseContacts">
      <div className="listContent">
        <List list={list}></List>
      </div>
      <div>
        <Button
          className="bottomBtn"
          title={"Pull the latest status"}
          onClick={onPullAllContacts}
        />
      </div>
    </div>
  );
}

export default observer(PolyContacts);
