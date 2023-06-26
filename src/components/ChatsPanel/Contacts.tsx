import React, { useState } from "react";

import {
  IonAvatar,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { observer } from "mobx-react";
import { ContactIcon } from "../../icons";
import { Button } from "../Button";

import "./Contacts.scss";
import { EmptyList } from "../../EmptyList";
import { Tabs } from "../Tabs/Tabs";

export enum STARCH_TYPE {
  WALLET = "Wallet",
  DOTBIT = "Dot.Bit",
  ENS = "ENS",
}

const items = [
  {
    label: 'Flowers',
    key: 'Flowers',
    children: <SingleContactList />,
  },
  {
    label: 'Flowing',
    key: 'Flowing',
    children: <EmptyList icon={<ContactIcon />} title="Your contact list is empty" />,
  },
  {
    label: 'Request',
    key: 'Request',
    children: <EmptyList icon={<ContactIcon />} title="Your contact list is empty" />,
  },
]
function ContactItem() {
  return (
    <IonItem
    className="chatListItem"
  >
    <IonAvatar slot="start" className="messageListAvatar">
      <img src={""} alt="" />
    </IonAvatar>
    <IonLabel className="messageBody">
      <p className="upText">{"sydsun"}</p>
      <p className="downText">{"userId"}</p>
    </IonLabel>
  </IonItem>
  )
}

function SingleContactList() {
  return (
    <div>
       <ContactItem />
       <ContactItem />
       <ContactItem />
       <ContactItem />
       <ContactItem />
    </div>
  )
}
const Contacts: React.FC = () => {

  return (
    <div className="mq-contacts">
      <Tabs items={items} defaultActiveKey="Flowers" />
    </div>
  );
};
export default observer(Contacts);
