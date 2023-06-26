import React, {  } from "react";
import { observer } from "mobx-react";
import { Tabs } from "../Tabs/Tabs";
import Chats from "./Chats";

import "./index.scss";
import Contacts from "./Contacts";

const items = [
  {
    label: 'Chats',
    key: 'Chats',
    children: <Chats />,
  },
  {
    label: 'Contacts',
    key: 'Contacts',
    children: <Contacts />,
  },
]

const ChatsPanel = () => {
  return (
    <div className="chatsPanel">
      <Tabs items={items} defaultActiveKey="Chats"></Tabs>
    </div>
  );
};
export default observer(ChatsPanel);
