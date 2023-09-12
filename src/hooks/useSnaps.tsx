import { useStore } from "../services/mobx/service";
import { useSnapClient } from "./useSnapClient";
import {
  FollowOperationDto,
  PageDto,
  RequestFollowRpcDto,
} from "../services/snap/dto";

export const useSnaps = () => {
  const { snapClient } = useSnapClient();
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
    setContactsList,
    setFollowerList,
    setFollowingList,
    setFriendRequestList,
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
    const res = await snapClient
      .getMessageList({
        option: {
          page: 1,
          size: 30,
        },
        topic: payload,
      })
      .catch((e) => {
        console.log(e, "getMessages - error");
      });
    res && setMessageList(res);
    showRes && setCurrentMessages(JSON.stringify(res, null, "\t"));
  };

  const getUserId = async (address: string) => {
    const users = await snapClient
      .getUserIdByAddress({ address })
      .catch((e) => {
        console.log(e, "getUserIdByAddress - error");
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

  const getContactList = async (payload: PageDto) => {
    const response = await snapClient.getContactList(payload).catch((e) => {
      console.log(e, "getContactList - error");
    });
    setContactsList(response.user_list);
    return response;
  };
  const getFollowerList = async (payload: PageDto) => {
    const response = await snapClient.getFollowerList(payload).catch((e) => {
      console.log(e, "getFollowerList - error");
    });
    setFollowerList(response.user_list);
    return response;
  };
  const getFollowingList = async (payload: PageDto) => {
    const response = await snapClient.getFollowingList(payload).catch((e) => {
      console.log(e, "getFollowingList - error");
    });
    setFollowingList(response.user_list);
    return response;
  };
  const getMyFriendRequestList = async (payload: PageDto) => {
    const response = await snapClient
      .getMyFriendRequestList(payload)
      .catch((e) => {
        console.log(e, "getMyFriendRequestList - error");
      });
    setFriendRequestList(response);
    return response;
  };
  // follow request in following list
  const requestFollow = async (payload: RequestFollowRpcDto) => {
    const response = await snapClient.requestFollow(payload).catch((e) => {
      console.log(e, "requestFollow - error");
    });
    return response;
  };
  // follow opt in follower list
  // follow or unfollow
  const followOperation = async (payload: FollowOperationDto) => {
    const response = await snapClient.followOperation(payload).catch((e) => {
      console.log(e, "followOperation - error");
    });
    return response;
  };

  const getContactsAll = async () => {
    const batch = Promise.all([
      getFollowerList({ page: 1, size: 30 }),
      getFollowingList({ page: 1, size: 30 }),
    ])
    await batch
  }

  return {
    snapClient,
    creatRoom,
    getTopic,
    getMessages,
    getChannelList,
    getUserId,
    getContactList,
    getFollowerList,
    getFollowingList,
    getContactsAll,
    requestFollow,
    followOperation,
    getMyFriendRequestList,
  };
};
