import {
  connectWeb3MQSnaps,
  createRoomsBySnaps,
  getChannelListBySnaps,
  getInstance, getMessagesBySnaps,
  initSnaps,
  registerBySnaps
} from "../services/utils/snaps";
import {getKeys, setKeys, sleep} from "../services/utils/utils";
import {useStore} from "../services/mobx/service";

export const useSnaps = () => {
  const store = useStore()
  const { setCurrentMessages, channelList, setMessageList, setIsConnected, activeChannel, setActiveChannel } = store

// 连接snap后获取keys
  const connectWeb3Mq = async () => {
    await connectWeb3MQSnaps();
    await initSnaps()
    if (getKeys()) {
      await getInstance(getKeys())
      await sleep(3000);
      setIsConnected(true)
    } else {
      return await register()
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
      setIsConnected(true)
      return getKeys()
    } catch (err: any) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };


  const getChannelList = async (showRes: boolean = false, setActiveTopic: boolean = false) => {
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
        setActiveChannel(response[0].topic)
      } else {
        alert('Please Create Room')
      }
    }
    return response;
  };


// 创建房间
  const creatRoom = async (showRes: boolean = false, roomName: string = '') => {
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
      return activeChannel
    }
    if (channelList.length <= 0) {
      await getChannelList(false, true);
    }
    return activeChannel
  };


  const getMessages = async (showRes: boolean = false, topic: string = '') => {
    // if (!isConnected) {
      await connectWeb3Mq();
    // }
    let payload = topic ? topic : activeChannel
    if (!payload) {
      alert('Please Choose Channel')
      return false
    }
    const res = await getMessagesBySnaps(payload).catch((e) => {
      console.log(e, "getMessages - error");
    });
    res && setMessageList(res);
    showRes && setCurrentMessages(JSON.stringify(res, null, "\t"));
  };



  return {
    register,
    connectWeb3Mq,
    creatRoom,
    getTopic,
    getMessages,
    getChannelList
  };
};