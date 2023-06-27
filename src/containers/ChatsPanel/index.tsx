import { observer } from "mobx-react";
import { Tabs } from "../../components/Tabs/Tabs";
import ChatList from "./ChatList";
import PolyContacts from "./ContactList/PolyContacts";

import "./index.scss";

const items = [
  {
    label: 'Chats',
    key: 'Chats',
    children: <ChatList />,
  },
  {
    label: 'Followers',
    key: 'Followers',
    children: <PolyContacts type="flower" />,
  },
  {
    label: 'Following',
    key: 'Following',
    children: <PolyContacts type="folowing" />,
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
