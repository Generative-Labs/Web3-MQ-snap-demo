import { BaseSnapClient } from "./BaseSnapClient";
import {
  ConnectRpcDto,
  CreateRoomDto,
  GetChannelListRpcDto,
  GetMessageListRpcDto,
  GetUserIdByAddressDto,
  SendMessageRpcDto,
  SendNotifyMessageRpcDto,
} from "./dto";

export class SnapClient extends BaseSnapClient {
  connectToWeb3MQ = (payload: ConnectRpcDto) => this.createSnapRpc<ConnectRpcDto>("connectToWeb3MQ")(payload)

  creatRoom = (payload: CreateRoomDto) => this.createSnapRpc<CreateRoomDto>("creatRoom")(payload)

  getChannelList = (payload: GetChannelListRpcDto) => this.createSnapRpc<GetChannelListRpcDto>("getChannelList")(payload)

  sendNotifyMessage = (payload: SendNotifyMessageRpcDto) => this.createSnapRpc<SendNotifyMessageRpcDto>("sendNotifyMessage")(payload)

  sendMessage = (payload: SendMessageRpcDto) => this.createSnapRpc<SendMessageRpcDto>("sendNotifyMessage")(payload)

  getMessageList = (payload: GetMessageListRpcDto) => this.createSnapRpc<GetMessageListRpcDto>("sendNotifyMessage")(payload)

  getUserIdByAddress = (payload: GetUserIdByAddressDto) => this.createSnapRpc<GetUserIdByAddressDto>("getUserIdByAddress")(payload)
}
