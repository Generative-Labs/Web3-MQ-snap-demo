export type ConnectRpcDto = {
  password: string
  nickname: string
}

export type SendNotifyMessageRpcDto = {
  message: string
}

export type GetChannelListRpcDto = {
  options?: {
    page: number,
    size: number,
  }
}

export type GetMessageListRpcDto = {
  option?: {
    page?: number;
    size?: number;
  }
  topic: string
}

export type SendMessageRpcDto = {
  msg: string
  topic: string
}

export type CreateRoomDto = {
  group_name?: string
}

export type GetUserIdByAddressDto = {
  address: string
}
export type PageDto = {
  page?: number;
  size?: number;
};
export type RequestFollowRpcDto = {
  target_id: string;
  content?: string;
};

export type WalletType = 'eth' | 'starknet' | 'qrcode';

export type FollowOperationDto  = {
  address: string;
  targetUserid: string;
  action: 'follow' | 'cancel';
  didType: WalletType;
}

export type FollowStatusDto = 'following' | 'follower' | 'follow_each';
export type UserPermissionsDto = Record<string, { type: string; value: boolean }>;
export type ContactListItemType = {
  avatar_url: string;
  follow_status: FollowStatusDto;
  nickname: string;
  permissions: UserPermissionsDto;
  userid: string;
  wallet_address: string;
  wallet_type: WalletType;
};