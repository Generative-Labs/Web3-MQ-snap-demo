import { useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import { useIonLoading } from "@ionic/react";
import { useSnaps } from "../../../../hooks/useSnaps";
import { useStore } from "../../../../services/mobx/service";
import { ContactListItemType } from "../../../../services/snap/dto";
import { Button } from "../../../../components/Button";
import { EmptyList } from "../../../../components/EmptyList";
import { ContactIcon } from "../../../../icons";
import ContactItem from "../../../../components/ContactItem";
import "./index.scss";

interface IProp {
  list: ContactListItemType[]
}

function List({ list }: IProp) {
  if (!list?.length) {
    return <EmptyList icon={<ContactIcon />} title="Your contact list is empty"/>
  }
  return (
    <div className="mq-contact-list">
      {list.map((item) => {
        return (
          <ContactItem key={item.userid} user={item}/>
        )
      })}
    </div>
  )
}

interface IBaseContactsProp {
  type: "flower" | "folowing" | "request" | "contacts";
}

function PolyContacts({ type }: IBaseContactsProp) {
  const {
    contactsList,
    followingList,
    followerList,
    friendRequestList,
  } = useStore();
  const [present, dismiss] = useIonLoading();
  const {
    getContactsAll,
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
    try {
      await present({ message: "Loading..." });
      await getContactsAll()
    } finally {
      await dismiss();
    }
  }, [dismiss, getContactsAll, present]);

  return (
    <div className="mq-baseContacts">
      <div className="listContent">
        <List list={list}></List>
      </div>
      <div className="contactsFooter">
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
