import PolyContacts from "./PolyContacts";
import { Tabs } from "../../../components/Tabs/Tabs";

import "./ContactList.scss";

const items = [
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
  {
    label: 'Request',
    key: 'Request',
    children: <PolyContacts type="request" />,
  },
]

const ContactList = () => {
  return (
    <div className="mq-contacts">
      <Tabs items={items} defaultActiveKey="Followers" />
    </div>
  );
};
export default ContactList;
