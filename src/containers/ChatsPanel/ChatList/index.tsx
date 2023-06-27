import { useCallback, useState } from "react";

import {
  IonIcon,
  IonInput,
  useIonLoading,
  InputCustomEvent,
} from "@ionic/react";

import {
  chevronDownOutline,
  searchOutline,
} from "ionicons/icons";
import { observer } from "mobx-react";

import { useSnaps } from "../../../hooks/useSnaps";
import { getAddressByDids } from "../../../services/utils/utils";
import { useStore } from "../../../services/mobx/service";
import { List } from "./list";
import { Button } from "../../../components/Button";
import { SearchContactListList } from "./SearchContactList";
import { STARCH_TYPE, searchTypes } from "../../../utils/const";

import "./index.scss";

const ChatList = () => {
  const [showSearchList, setShowSearchList] = useState<boolean>(false)
  const { channelList } = useStore()
  const [present, dismiss] = useIonLoading();
  const { getUserId, getChannelList } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");
  const [searchType, setSearchType] = useState<STARCH_TYPE>(STARCH_TYPE.WALLET);

  // const showSearchList = useMemo(() => readySendMessage && )

  async function onPullChats() {
    try {
      await present({
        message: "Loading...",
      });
      await getChannelList();
    } finally {
      await dismiss();
    }
  }

  const onSearch = useCallback(async () => {
    if (!readySendMessage) {
      return
    }
    let address = readySendMessage;
    await present({ message: "Loading..." });
    try {
      if (searchType !== STARCH_TYPE.WALLET) {
        address = await getAddressByDids(searchType, readySendMessage);
      }
      console.log(address, "address");
      await getUserId(address);
      setShowSearchList(true)
    } finally {
      await dismiss();
    }
  }, [dismiss, getUserId, present, readySendMessage, searchType])

  const onSearchInputChange = (e: InputCustomEvent) => {
    if (!e.detail.value) {
      setShowSearchList(false)
    }
    setReadySendMessage(e.detail.value!);
  }

  return (
    <div className="mq-chats">
      <div className="searchForm">
        <div className="searchUserBox">
          <div className="searchTypeBox">
            <div className="searchType">
              {searchType}
              <IonIcon
                style={{ color: "#000", fontSize: "14px" }}
                slot="icon-only"
                icon={chevronDownOutline}
              />
            </div>
            <div className="selectSearchType">
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
            className="input"
            value={readySendMessage}
            placeholder="Write a message"
            onIonChange={onSearchInputChange}
          />
          <IonIcon
            className="searchButton"
            slot="icon-only"
            icon={searchOutline}
            onClick={onSearch}
          />
        </div>
      </div>
      {showSearchList && <SearchContactListList readySendMessage={readySendMessage} />}
      {!showSearchList && <List list={channelList}/>}
      <div className="pullChatsBtnOuter">
        {!showSearchList && <Button className="bottomBtn" title={"Pull the latest status"} onClick={onPullChats} />}
      </div>
    </div>
  );
};
export default observer(ChatList);
