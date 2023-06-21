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
  didType?: WalletType;
  didValue: string;
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
  userid: string;
};

export type WalletType = "eth" | "starknet" | "qrcode";

export type FollowOperationDto = {
  address: string;
  targetUserid: string;
  action: "follow" | "cancel";
  didType: WalletType;
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
