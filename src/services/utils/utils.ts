import { createInstance } from "dotbit";
import Web3 from "web3";
import { STARCH_TYPE } from "../../utils/const";
//@ts-ignore
const web3 = new Web3(window.ethereum);
const dotbit = createInstance();

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
export const setKeys = (data: any) => {
  localStorage.setItem("web3_mq_keys", JSON.stringify(data));
};

export const getLoginUserId = () => {
  return `user:${getKeys().PublicKey}`;
};

export function getShortAddressByAddress(
    address: string = '',
    num: number = 5,
    endNum = 4
) {
  let strLength = address.length;
  return (
      address.substring(0, num) +
      '...' +
      address.substring(strLength - endNum, strLength)
  );
}

export const getAddressByDids = async (type: STARCH_TYPE, value: string) => {
  if (type === STARCH_TYPE.DOTBIT) {
    console.log("dasloveckb.bit");
    const data = await dotbit.records(value);
    console.log(data, "data");
    let ethAddress = data && data.find((item) => item.key === "address.eth");
    console.log(ethAddress, "ethAddress");
    return ethAddress?.value || "";
  }

  if (type === STARCH_TYPE.ENS) {
    const address = await web3.eth.ens.getAddress(value);
    console.log(address, "address");
    return address;
  }
  return "";
};

export const getGroupName = (group: any) => {
  if (group.chat_name) {
    return group.chat_name;
  } else {
    return getShortAddressByAddress(group.topic);
  }
};

export const getUserName = (user: any) => {
  if (user.nickname) {
    return user.nickname;
  } else if (user.wallet_address) {
    return getShortAddressByAddress(user.wallet_address, 6);
  } else {
    return getShortAddressByAddress(user.userid);
  }
};
export const getUserAvatar = (address: string) =>  {
  return `https://cdn.stamp.fyi/avatar/${address}?s=300`;
};