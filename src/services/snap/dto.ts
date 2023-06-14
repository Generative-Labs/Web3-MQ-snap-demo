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