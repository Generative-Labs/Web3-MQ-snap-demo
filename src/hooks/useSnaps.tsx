import {
  connectWeb3MQSnaps,
  createRoomsBySnaps,
  getChannelListBySnaps,
  getInstance,
  getMessagesBySnaps,
  getUserIdByAddress,
  initSnaps,
  registerBySnaps,
} from "../services/utils/snaps";
import {
  getKeys,
  getShortAddressByAddress,
  setKeys,
  sleep,
} from "../services/utils/utils";
import { useStore } from "../services/mobx/service";
import { paw } from "ionicons/icons";

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
    await connectWeb3MQSnaps();
    await initSnaps();
    if (getKeys()) {
      await getInstance(getKeys());
      await sleep(3000);
      setIsConnected(true);
    } else {
      return await register();
    }
  };
  // 注册后获取返回keys
  const register = async (showRes: boolean = false) => {
    try {
      const initResponse = await initSnaps();
      if (!initResponse) alert("something was wrong, please retry");
      const registerRes = await registerBySnaps(initResponse);
      setKeys(registerRes);
      await getInstance(getKeys());
      await sleep(3000);
      setIsConnected(true);
      return getKeys();
    } catch (err: any) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };

  const getChannelList = async (
    showRes: boolean = false,
    setActiveTopic: boolean = false
  ) => {
    // if (!isConnected) {
    await connectWeb3Mq();
    // }
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
      //@ts-ignore
      // if (!isConnected) {
      await connectWeb3Mq();
      // }
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
    // if (!isConnected) {
    await connectWeb3Mq();
    // }
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
    await connectWeb3Mq();
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
    register,
    connectWeb3Mq,
    creatRoom,
    getTopic,
    getMessages,
    getChannelList,
    getUserId,
  };
};
