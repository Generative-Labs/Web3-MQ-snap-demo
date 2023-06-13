import {
  createRoomsBySnaps,
  getChannelListBySnaps,
  getMessagesBySnaps,
  getUserIdByAddress,
} from "../services/utils/snaps";
import {
  getShortAddressByAddress,
  sleep,
} from "../services/utils/utils";
import { useStore } from "../services/mobx/service";
import { paw } from "ionicons/icons";
import { connectSnap } from "../utils";

export const useSnaps = () => {
  const store = useStore();
  const {
    setCurrentMessages,
    channelList,
    setMessageList,
    setIsConnected,
    activeChannel,
    setActiveChannel,
    setActiveChannelItem,
    setSearchUsers,
    setActiveUser,
  } = store;

  // 连接snap后获取keys
  const connectWeb3Mq = async () => {
    await connectSnap();
  };

  const getChannelList = async (
    showRes: boolean = false,
    setActiveTopic: boolean = false
  ) => {
    const response = await getChannelListBySnaps().catch((e) => {
      console.log(e, "getChannelListBySnaps - error");
    });
    showRes && setCurrentMessages(JSON.stringify(response, null, "\t"));
    await store.setChannelList(response);
    if (setActiveTopic) {
      if (response && response.length > 0) {
        setActiveChannel(response[0].topic);
        setActiveChannelItem(response[0]);
      } else {
        alert("Please Create Room");
      }
    }
    return response;
  };

  // 创建房间
  const creatRoom = async (showRes: boolean = false, roomName: string = "") => {
    try {
      const response = await createRoomsBySnaps(roomName);
      showRes && setCurrentMessages(JSON.stringify(response, null, "\t"));
      await getChannelList();
    } catch (err: any) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };
  const getTopic = async () => {
    if (activeChannel) {
      return activeChannel;
    }
    if (channelList.length <= 0) {
      await getChannelList(false, true);
    }
    return activeChannel;
  };

  const getMessages = async (showRes: boolean = false, topic: string = "") => {
    let payload = topic ? topic : activeChannel;
    if (!payload) {
      alert("Please Choose Channel");
      return false;
    }
    const res = await getMessagesBySnaps(payload).catch((e) => {
      console.log(e, "getMessages - error");
    });
    res && setMessageList(res);
    showRes && setCurrentMessages(JSON.stringify(res, null, "\t"));
    console.log(res, "get messages");
  };

  const getUserId = async (address: string) => {
    const users = await getUserIdByAddress(address).catch((e) => {
      console.log(e, "getUserIdByAddress - errir");
    });
    if (users && users.length > 0) {
      setSearchUsers(users);
      if (users.length === 1) {
        setActiveChannel(users[0].userid);
        setActiveUser(users[0]);
      }
    } else {
      setSearchUsers([]);
      let roomName = `Chat with ${getShortAddressByAddress(address, 6)}`;
      // creatRoom(false, roomName)
      setActiveUser(null);
      setActiveChannel("");
    }
  };

  return {
    connectWeb3Mq,
    creatRoom,
    getTopic,
    getMessages,
    getChannelList,
    getUserId,
  };
};
