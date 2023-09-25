import copy from "copy-to-clipboard";
import { IonButton } from "@ionic/react";
import ContactItem from "../../../components/ContactItem";
import { observer } from "mobx-react";
import { useStore } from "../../../services/mobx/service";

import './SearchContactList.scss';
import { useCallback } from "react";

interface IProp {
  readySendMessage: string
}

export const SearchContactListList = observer(({ readySendMessage = '' }: IProp) => {
  const { searchUsers, updateTodoItem } = useStore()

  const onSuccess = useCallback((res: any) => {
    if (!res?.data?.follow_status || !searchUsers?.length) {
      return
    }
    const data = res.data
    updateTodoItem(data.target_userid, data.follow_status)
  }, [searchUsers, updateTodoItem])

  if (!searchUsers?.length) {
    return (
      <div className="mq-search-empty">
        <div className="top">
          This address/did is not on Web3MQ yet, invite them to join with
        </div>
        <div
          className="bottom"
          onClick={() => {
            copy("https://web3mq-snap-demo.pages.dev");
          }}
        >
          {`"Chat with ${readySendMessage}"`}
          <div className="copyTopic">
            <IonButton
              className="oneButton"
              onClick={async () => {
                copy("https://web3mq-snap-demo.pages.dev");
              }}
            >
              Copy to clipboard
            </IonButton>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mq-searchlist">
      {searchUsers.map((item, index) => {
        return <ContactItem key={item.userid} user={item} onSuccess={onSuccess} />;
      })}
    </div>
  );
})
