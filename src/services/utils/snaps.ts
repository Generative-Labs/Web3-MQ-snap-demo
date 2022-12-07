// const newSnapId = `npm:web3-mq-snaps`;
const newSnapId = `local:http://localhost:8081/`;

export const connectWeb3MQSnaps = async () => {
  //@ts-ignore
  const res = await ethereum.request({
    method: "wallet_enable",
    params: [
      {
        wallet_snap: {
          [newSnapId]: {
            version: "1.0.5",
          },
        },
      },
    ],
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
    params: [
      newSnapId,
      {
        method: "queryChannelList",
        params: { options: { page: 1, size: 100 } },
      },
    ],
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
    params: [
      newSnapId,
      {
        method: "creatRoom",
        params: { group_name: roomName },
      },
    ],
  });
};
export const sendNotifyMessage = async (message: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "sendNotifyMessage",
        params: { message },
      },
    ],
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
}
