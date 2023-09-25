import { createInstance } from "dotbit";
import Web3 from "web3";
import { STARCH_TYPE } from "../../utils/const";
//@ts-ignore
const web3 = new Web3(window.ethereum);
const dotbit = createInstance();

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getShortAddressByAddress(
  address: string = "",
  num: number = 5,
  endNum = 4
) {
  let strLength = address.length;
  return (
    address.substring(0, num) +
    "..." +
    address.substring(strLength - endNum, strLength)
  );
}

export const getAddressByDids = async (type: STARCH_TYPE, value: string) => {
  if (type === STARCH_TYPE.DOTBIT) {
    const data = await dotbit.records(value);
    let ethAddress = data && data.find((item) => item.key === "address.eth");
    return ethAddress?.value || "";
  }

  if (type === STARCH_TYPE.ENS) {
    const address = await web3.eth.ens.getAddress(value);
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
