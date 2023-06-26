import React, {  } from "react";
import { observer } from "mobx-react";
import { Tabs } from "../Tabs/Tabs";
import ChatList from "./ChatList/ChatList";
import ContactsList from "./ContactList/ContactList";

import "./index.scss";

const items = [
  {
    label: 'Chats',
    key: 'Chats',
    children: <ChatList />,
  },
  {
    label: 'Contacts',
    key: 'Contacts',
    children: <ContactsList />,
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
