import { useStore } from "../services/mobx/service";
import { useSnapClient } from "./useSnapClient";

export const useSnaps = () => {
  const { snapClient } = useSnapClient()
  const store = useStore();
  const {
    setCurrentMessages,
    channelList,
    setMessageList,
    activeChannel,
    setActiveChannel,
    setActiveChannelItem,
    setSearchUsers,
    setActiveUser,
  } = store;

  const getChannelList = async (
    showRes: boolean = false,
    setActiveTopic: boolean = false
  ) => {
    const response = await snapClient.getChannelList({}).catch((e) => {
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
      const response = await snapClient.creatRoom({ group_name: roomName });
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
    const res = await snapClient.getMessageList({ topic: payload }).catch((e) => {
      console.log(e, "getMessages - error");
    });
    res && setMessageList(res);
    showRes && setCurrentMessages(JSON.stringify(res, null, "\t"));
    console.log(res, "get messages");
  };

  const getUserId = async (address: string) => {
    const users = await snapClient.getUserIdByAddress({ address }).catch((e) => {
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
      // creatRoom(false, roomName)
      setActiveUser(null);
      setActiveChannel("");
    }
  };

  return {
    creatRoom,
    getTopic,
    getMessages,
    getChannelList,
    getUserId,
  };
};
