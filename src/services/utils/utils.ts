import { createInstance } from "dotbit";
import Web3 from "web3";
import { STARCH_TYPE } from "../../components/Channels";
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

export function getShortAddressByAddress(address: string) {
  let strLength = address.length;
  return (
    address.substring(0, 10) +
    "..." +
    address.substring(strLength - 4, strLength)
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
