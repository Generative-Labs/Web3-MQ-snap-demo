const newSnapId = `npm:web3-mq-snaps`;
// const newSnapId = `local:http://localhost:8081/`;


export const connectWeb3MQSnaps = async () => {
  //@ts-ignore
  const res = await ethereum.request({
    method: "wallet_enable",
    params: [
      {
        wallet_snap: {
          [newSnapId]: {
            version: "1.0.2",
          },
        },
      },
    ],
  });
  console.log(res, "connect snap success ");
};

export const getInstance = async (keys: any) => {
  try {
    //@ts-ignore
    const response = await ethereum.request({
      method: "wallet_invokeSnap",
      params: [
        newSnapId,
        {
          method: "getInstance",
          payload: keys,
        },
      ],
    });
    console.log("getInstance Web3-MQ success");
  } catch (err: any) {
    console.error(err);
    alert("Problem happened: " + err.message || err);
  }
};

export const sendMessageBySnaps = async (msg: string, topic: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "sendMessage",
        payload: { msg, topic },
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
        payload: { options: { page: 1, size: 100 } },
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
        payload: {
          options: { page: 1, size: 100 },
          topic,
        },
      },
    ],
  });
};

export const initSnaps = async () => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "init",
        payload: {
          app_key: "vAUJTFXbBZRkEDRE",
          env: "dev",
          connectUrl: "https://dev-ap-jp-1.web3mq.com",
        },
      },
    ],
  });
};

export const registerBySnaps = async (signContentURI: string) => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "register",
        payload: { signContentURI },
      },
    ],
  });
};

export const createRoomsBySnaps = async () => {
  //@ts-ignore
  return await ethereum.request({
    method: "wallet_invokeSnap",
    params: [
      newSnapId,
      {
        method: "creatRoom",
      },
    ],
  });
};

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const setConnected = (data: string) => {
  localStorage.setItem("web3-mq-connected", data);
};

export const isConnected = () => {
  return !!localStorage.getItem("web3-mq-connected");
};

export const getKeys = () => {
  if (localStorage.getItem("web3_mq_keys")) {
    return JSON.parse(localStorage.getItem("web3_mq_keys") || "");
  }
  return null;
};
export const setKeys = (data: string) => {
  localStorage.setItem("web3_mq_keys", data);
};
