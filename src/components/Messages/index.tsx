import React from "react";

import { IonButton, IonCard } from "@ionic/react";

import ss from "./index.module.scss";
import { observer } from "mobx-react";
import { useStore } from "../../services/mobx/service";
import { useSnaps } from "../../hooks/useSnaps";

const Messages: React.FC = () => {
  const { messageList } = useStore();
  const { getMessages } = useSnaps();

  return (
    <IonCard className={ss.box}>
      <h1>Message List</h1>
      <IonButton
        onClick={async () => {
          await getMessages(true);
        }}
      >
        Get Message List
      </IonButton>
      <ul>
        {messageList &&
          messageList.length > 0 &&
          messageList.map((item, index) => <li key={index}>{item.content}</li>)}
      </ul>
    </IonCard>
  );
};
export default observer(Messages);
