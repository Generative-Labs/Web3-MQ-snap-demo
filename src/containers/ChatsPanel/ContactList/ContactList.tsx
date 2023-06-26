import PolyContacts from "./PolyContacts";
import { Tabs } from "../../../components/Tabs/Tabs";

import "./ContactList.scss";

const items = [
  {
    label: 'Flowers',
    key: 'Flowers',
    children: <PolyContacts type="flower" />,
  },
  {
    label: 'Folowing',
    key: 'Folowing',
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
      <Tabs items={items} defaultActiveKey="Flowers" />
    </div>
  );
};
export default ContactList;
