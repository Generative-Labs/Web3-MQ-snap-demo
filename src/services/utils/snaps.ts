// const newSnapId = `npm:web3-mq-snaps`;
// const newSnapId = `local:http://localhost:3001/`;
export const newSnapId = `local:http://localhost:8080`;

export const connectWeb3MQSnaps = async () => {
  //@ts-ignore
  const res = await ethereum.request({
    method: "wallet_requestSnaps",
    params: {
      [newSnapId]: {},
    },
  });
  console.log(res, "connect snap success ");
};
export const sendMessageBySnaps = async (msg: string, topic: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "sendMessage",
        params: { msg, topic },
      },
    ],
  });
};

export const getChannelListBySnaps = async () => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: newSnapId,
      request: {
        method: "getChannelList",
        params: {
          options: {
            page: 1,
            size: 100,
          },
        },
      },
    },
  });
};

export const getMessagesBySnaps = async (topic: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "getMessageList",
        params: {
          options: { page: 1, size: 100 },
          topic,
        },
      },
    ],
  });
};

export const createRoomsBySnaps = async (roomName: string = "") => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: newSnapId,
      request: {
        method: "creatRoom",
        params: {
          group_name: roomName,
        },
      },
    },
  });
};
export const sendNotifyMessage = async (message: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: newSnapId,
      request: {
        method: "sendNotifyMessage",
        params: { message },
      },
    },
  });
};
export const getUserIdByAddress = async (address: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "getTargetUserId",
        params: { address },
      },
    ],
  });
};
