// snap rpc response type
export interface SnapRpcResponse<T = any> {
  code: number;
  msg: string;
  data: T
}

export type SendNotifyMessageRpcDto = {
  message: string;
};

export type GetChannelListRpcDto = {
  options?: {
    page: number;
    size: number;
  };
};

export type GetMessageListRpcDto = {
  option?: {
    page?: number;
    size?: number;
  };
  topic: string;
};

export type SendMessageRpcDto = {
  msg: string;
  topic: string;
};

export type CreateRoomDto = {
  group_name?: string;
};

export type GetUserIdByAddressDto = {
  address: string;
};
export type PageDto = {
  page?: number;
  size?: number;
};
export type CheckUserDto = { address: string };
export type RequestFollowRpcDto = {
  target_id: string;
  content?: string;
};
export type GetKeysSignContentDto = {
  password: string;
  address: string;
  walletType?: WalletType;
};
export type GetKeysDto = {
  password: string;
  signature: string;
};
export type GetRegisterSignContentDto = {
  userid: string;
  mainPublicKey: string;
  walletType: WalletType;
  walletAddress: string;
  signContentURI?: string;
};

export type ConnectRpcDto = {
  mainPrivateKey?: string; // in snap state || register
  mainPublicKey?: string; // in snap state  || register
  walletType?: WalletType;
  walletAddress: string;
  password: string;
  pubkeyExpiredTimestamp?: number;
  userid?: string;
};
export type RegisterToWeb3MQDto = {
  mainPrivateKey: string; // in snap state || register
  mainPublicKey: string; // in snap state  || register
  walletType?: WalletType;
  walletAddress: string;
  password: string;
  signature: string; // require by register
  didPubkey?: string; // require by starknet
  registerSignContent: string; // require by register
  registerTime: number; // require by register
  nickname?: string;
  avatarUrl?: string;
  // isRetry?: boolean;
  userid: string;
};

export type WalletType = "eth" | "starknet" | "qrcode";

export type FollowOperationDto = {
  targetId: string;
  action: 'follow' | 'cancel';
  signature: string;
  didPubKey?: string;
  walletType?: WalletType;
  signContent: string;
  signTimestamp: number;
};

export type FollowStatusDto = "following" | "follower" | "follow_each";
export type UserPermissionsDto = Record<
  string,
  { type: string; value: boolean }
>;
export type ContactListItemType = {
  avatar_url: string;
  follow_status: FollowStatusDto;
  nickname: string;
  permissions: UserPermissionsDto;
  userid: string;
  wallet_address: string;
  wallet_type: WalletType;
};

export type SearchContactListItemType = {
  avatar_url: string;
  // not exist
  follow_status?: string;
  nickname: string;
  userid: string;
  wallet_address: string;
  wallet_type: WalletType;
};

export type ChannelItemType = {
  avatar_base64: string;
  avatar_url: string;
  chat_name: string;
  chat_type: string;
  chatid: string;
  topic: string;
  topic_type: string;
};

export type GetFollowSignContentDto = {
  walletAddress: string;
  targetUserid: string;
  action: 'follow' | 'cancel';
  walletType: WalletType;
};

export type SignFollowContentRes = {
  signContent: string
  signTimestamp: number
}

export type FollowOperationRes = {
  action: string
  follow_status: string
  target_userid: string
  userid: string
}

export type Web3MQKeysRes = {
  privateKey: string
  publicKey: string
  userid: string
  walletAddress: string
  mainPrivateKey: string
  mainPublicKey: string
  didKey: string
  pubkeyExpiredTimestamp: string
}
