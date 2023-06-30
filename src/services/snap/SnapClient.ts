import { BaseSnapClient } from "./BaseSnapClient";
import {
  CheckUserDto,
  ConnectRpcDto,
  CreateRoomDto,
  FollowOperationDto,
  FollowOperationRes,
  GetChannelListRpcDto,
  GetFollowSignContentDto,
  GetKeysDto,
  GetKeysSignContentDto,
  GetMessageListRpcDto,
  GetRegisterSignContentDto,
  GetUserIdByAddressDto,
  PageDto,
  RegisterToWeb3MQDto,
  RequestFollowRpcDto,
  SendMessageRpcDto,
  SendNotifyMessageRpcDto,
  SignFollowContentRes,
  SnapRpcResponse,
  Web3MQKeysRes,
} from "./dto";

export class SnapClient extends BaseSnapClient {

  detectIsWeb3MqConnected = async () => {
    const { privateKey, publicKey, userid} = await this.exportWeb3MQKeys()
    if (privateKey && publicKey && userid) {
      return true
    }
    return false
  }

  disconnect = () => this.createSnapRpc("disconnect")({});
  
  connectToWeb3MQ = (payload: ConnectRpcDto) =>
    this.createSnapRpc<ConnectRpcDto>("connectToWeb3MQ")(payload);

  creatRoom = (payload: CreateRoomDto) =>
    this.createSnapRpc<CreateRoomDto>("creatRoom")(payload);

  getChannelList = (payload: GetChannelListRpcDto) =>
    this.createSnapRpc<GetChannelListRpcDto>("getChannelList")(payload);

  sendNotifyMessage = (payload: SendNotifyMessageRpcDto) =>
    this.createSnapRpc<SendNotifyMessageRpcDto>("sendNotifyMessage")(payload);

  sendMessage = (payload: SendMessageRpcDto) =>
    this.createSnapRpc<SendMessageRpcDto>("sendMessage")(payload);

  getMessageList = (payload: GetMessageListRpcDto) =>
    this.createSnapRpc<GetMessageListRpcDto>("getMessageList")(payload);

  getUserIdByAddress = (payload: GetUserIdByAddressDto) =>
    this.createSnapRpc<GetUserIdByAddressDto>("searchUser")(payload);
  getContactList = (payload: PageDto) =>
    this.createSnapRpc<PageDto>("getContactList")(payload);
  getFollowerList = (payload: PageDto) =>
    this.createSnapRpc<PageDto>("getFollowerList")(payload);
  getFollowingList = (payload: PageDto) =>
    this.createSnapRpc<PageDto>("getFollowingList")(payload);
  requestFollow = (payload: RequestFollowRpcDto) =>
    this.createSnapRpc<RequestFollowRpcDto>("requestFollow")(payload);

  followOperation = (payload: FollowOperationDto) =>
    this.createSnapRpc<FollowOperationDto, FollowOperationRes>("followOperation")(payload);

  getMyFriendRequestList = (payload: PageDto) =>
    this.createSnapRpc<PageDto>("getMyFriendRequestList")(payload);

  checkUserExist = (payload: CheckUserDto) =>
    this.createSnapRpc<CheckUserDto>("checkUserExist")(payload);

  getMainKeySignContent = (payload: GetKeysSignContentDto) =>
    this.createSnapRpc<GetKeysSignContentDto>("getMainKeySignContent")(payload);

  getMainKeypairBySignature = (payload: GetKeysDto) =>
    this.createSnapRpc<GetKeysDto>("getMainKeypairBySignature")(payload);

  exportWeb3MQKeys = () => this.createSnapRpc<any, Web3MQKeysRes>("exportWeb3MQKeys")({});

  getRegisterSignContent = (payload: GetRegisterSignContentDto) =>
    this.createSnapRpc<GetRegisterSignContentDto>("getRegisterSignContent")(
      payload
    );
  registerToWeb3MQNetwork = (payload: RegisterToWeb3MQDto) =>
    this.createSnapRpc<RegisterToWeb3MQDto>("registerToWeb3MQNetwork")(
      payload
    );
 
  getFollowSignContent = (payload: GetFollowSignContentDto) =>
  this.createSnapRpc<GetFollowSignContentDto, SignFollowContentRes>("getFollowSignContent")(
    payload
  );
 
}
