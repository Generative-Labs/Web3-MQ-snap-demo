import React, { useCallback, useState } from "react";

import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
  useIonToast,
} from "@ionic/react";

import {
  checkmarkCircleOutline,
  chevronDownOutline,
  searchOutline,
} from "ionicons/icons";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";
import userIcon from "../../assets/svg/user.svg";
import { getAddressByDids } from "../../services/utils/utils";
import copy from "copy-to-clipboard";
import { ChatIcon } from "../../icons";
import { Button } from "../Button";

import "./Chats.scss";
import { EmptyList } from "../../EmptyList";

export enum STARCH_TYPE {
  WALLET = "Wallet",
  DOTBIT = "Dot.Bit",
  ENS = "ENS",
}



const Chats: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  const { getUserId } = useSnaps();
  const [readySendMessage, setReadySendMessage] = useState("");
  const [searchType, setSearchType] = useState<STARCH_TYPE>(STARCH_TYPE.WALLET);

  const searchTypes: STARCH_TYPE[] = [
    STARCH_TYPE.WALLET,
    STARCH_TYPE.DOTBIT,
    STARCH_TYPE.ENS,
  ];

  function onPullChats() {

  }

  return (
    <div className="mq-chats">
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
          onIonChange={(e) => {
            setReadySendMessage(e.detail.value!);
          }}
        />
        <IonIcon
          className="searchButton"
          slot="icon-only"
          icon={searchOutline}
          onClick={async () => {
            console.log(readySendMessage, "readySendMessage");
            let address = readySendMessage;
            await present({ message: "Loading..." });
            if (searchType !== STARCH_TYPE.WALLET) {
              address = await getAddressByDids(searchType, readySendMessage);
            }
            console.log(address, "address");
            await getUserId(address);
            await dismiss();
          }}
        />
      </div>
      <div className="chatResult">
        <EmptyList icon={<ChatIcon />} title="Your message list is empty" />
      </div>
      <div>
        <Button className="bottomBtn" title={"Pull the latest status"} onClick={onPullChats} />
      </div>
    </div>
  );
};
export default observer(Chats);
