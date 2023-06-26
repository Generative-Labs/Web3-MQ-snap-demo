import { useCallback } from "react";
import { useIonLoading } from "@ionic/react";
import { observer } from "mobx-react";
import { ContactListItemType, SearchContactListItemType } from "../../../services/snap/dto";
import { getEthAccount, signWithEth } from "../../../utils/metamask";
import { Button } from "../../Button";
import { useSnaps } from "../../../hooks/useSnaps";

import './index.scss';

interface IContactOperateButton {
  user: ContactListItemType | SearchContactListItemType
  onSuccess?: (user: any) => void
}

/**
 * 1. follow
 * 2. following
 * 3. accept
 * export type FollowStatusDto = "following" | "follower" | "follow_each";
 */
export const ContactOperateButton = observer(({ user, onSuccess }: IContactOperateButton) => {
  const { follow_status = '' } = user;
  const [present, dismiss] = useIonLoading();
  const { getContactsAll } = useSnaps();
  const {
    snapClient,
  } = useSnaps();

  const doFollow = useCallback(async (action: 'follow' | 'cancel') => {
    await present({
      message: "Loading...",
    });
    try {
      const { address } = await getEthAccount()
      const { signContent, signTimestamp } = await snapClient.getFollowSignContent({
        walletAddress: address,
        targetUserid: user.userid,
        action,
        walletType: "eth",
      })
      const { sign } = await signWithEth(signContent, address)
      console.log(signContent)
      const res = await snapClient.followOperation({
        targetId: user.userid,
        action,
        signature: sign,
        signContent: signContent,
        signTimestamp: signTimestamp,
      })
      onSuccess && onSuccess(res)
      // refresh contact list
      await getContactsAll()
      console.log(res, 'followOperation')
    } finally {
      await dismiss();
    }
  }, [dismiss, getContactsAll, onSuccess, present, snapClient, user.userid])

  if (follow_status === 'following') {
    return <Button className="opBtn unfollow" title="Following" hoverTitle="Unfollow" onClick={() => doFollow('cancel')} />;
  } else if (follow_status === 'follower') {
    return <Button className="opBtn" title="Follow" onClick={() => doFollow('follow')} />;
  } else if (follow_status === 'follow_each') {
    return <Button className="opBtn unfollow" title="Friend" hoverTitle="Unfollow" onClick={() => doFollow('cancel')} />;
  }
  return <Button className="opBtn" title="Follow" onClick={() => doFollow('follow')} />;
})


