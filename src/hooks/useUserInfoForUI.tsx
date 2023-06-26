import { useMemo } from "react";
import { ContactListItemType } from "../services/snap/dto";
import { getShortAddressByAddress, getUserAvatar } from "../services/utils/utils";

import userIcon from "../../assets/svg/user.svg";

export function useUserInfoForUI(user: ContactListItemType) {
  const nickname = useMemo(() => {
    if (user.nickname) {
      return user.nickname
    }
    if (user.wallet_address) {
      return getShortAddressByAddress(user.wallet_address)
    }
    if (user.userid) {
      return getShortAddressByAddress(user.userid, 10, 6)
    }
    return '-'
  }, [user.nickname, user.userid, user.wallet_address]);

  const avatar = useMemo(() => {
    if (user.avatar_url) {
      return user.avatar_url
    }
    return getUserAvatar(user.wallet_address || user.userid) || userIcon
  }, [user.avatar_url, user.userid, user.wallet_address])
  return {
    nickname,
    avatar,
    topic: user.follow_status === "follow_each" ? user.userid : ""
  };
}