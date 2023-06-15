import { BaseSnapClient } from "./BaseSnapClient";
import {
  ConnectRpcDto,
  CreateRoomDto, FollowOperationDto,
  GetChannelListRpcDto,
  GetMessageListRpcDto,
  GetUserIdByAddressDto, PageDto, RequestFollowRpcDto,
  SendMessageRpcDto,
  SendNotifyMessageRpcDto,
} from "./dto";

export class SnapClient extends BaseSnapClient {
  connectToWeb3MQ = (payload: ConnectRpcDto) => this.createSnapRpc<ConnectRpcDto>("connectToWeb3MQ")(payload)

  creatRoom = (payload: CreateRoomDto) => this.createSnapRpc<CreateRoomDto>("creatRoom")(payload)

  getChannelList = (payload: GetChannelListRpcDto) => this.createSnapRpc<GetChannelListRpcDto>("getChannelList")(payload)

  sendNotifyMessage = (payload: SendNotifyMessageRpcDto) => this.createSnapRpc<SendNotifyMessageRpcDto>("sendNotifyMessage")(payload)

  sendMessage = (payload: SendMessageRpcDto) => this.createSnapRpc<SendMessageRpcDto>("sendNotifyMessage")(payload)

  getMessageList = (payload: GetMessageListRpcDto) => this.createSnapRpc<GetMessageListRpcDto>("getMessageList")(payload)

  getUserIdByAddress = (payload: GetUserIdByAddressDto) => this.createSnapRpc<GetUserIdByAddressDto>("searchUser")(payload)
  getContactList = (payload: PageDto) => this.createSnapRpc<PageDto>("getContactList")(payload)
  getFollowerList = (payload: PageDto) => this.createSnapRpc<PageDto>("getFollowerList")(payload)
  getFollowingList = (payload: PageDto) => this.createSnapRpc<PageDto>("getFollowingList")(payload)
  requestFollow = (payload: RequestFollowRpcDto) => this.createSnapRpc<RequestFollowRpcDto>("requestFollow")(payload)
  followOperation = (payload: FollowOperationDto) => this.createSnapRpc<FollowOperationDto>("followOperation")(payload)
  getMyFriendRequestList = (payload: PageDto) => this.createSnapRpc<PageDto>("getMyFriendRequestList")(payload)
}
