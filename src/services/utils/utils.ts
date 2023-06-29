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

export type SearchDidType = 'eth' | 'starknet' | 'web3mq';

export enum WEB3_MQ_DID_TYPE {
  PHONE = 'phone',
  EMAIL = 'email',
  LENS = 'lens.xyz',
  DOTBIT = 'dotbit',
  ENS = 'ens',
}

export type DidValueType = {
  did_type: WEB3_MQ_DID_TYPE;
  did_value: string;
  provider_id: string;
  detail: any;
};


export type CommonUserInfoType = {
  defaultUserName: string;
  defaultUserAvatar: string;
  address: string;
  didValues: DidValueType[];
  userid: string;
  stats: {
    total_followers: number;
    total_following: number;
  };
  wallet_type: string;
  wallet_address: string;
  permissions?: any;
  didValueMap: Record<WEB3_MQ_DID_TYPE, string>;
};

// export const getUserInfo = async (
//   didValue: string,
//   didType: SearchDidType,
//   bindDid: boolean = false,
// ): Promise<CommonUserInfoType | null> => {
//   const web3MqInfo = await getUserPublicProfileRequest({
//     did_type: didType,
//     did_value: didValue,
//     timestamp: Date.now(),
//     my_userid: client.keys.userid,
//   }).catch((e) => {
//     console.log(e);
//   });

//   if (web3MqInfo && web3MqInfo.data) {
//     const info = web3MqInfo.data;
//     const userInfo: CommonUserInfoType = {
//       ...info,
//       address: info.wallet_address,
//       defaultUserName: getShortAddress(info.wallet_address),
//       defaultUserAvatar: getUserAvatar(info.wallet_address),
//       didValueMap: {
//         [WEB3_MQ_DID_TYPE.LENS]: '',
//         [WEB3_MQ_DID_TYPE.ENS]: '',
//         [WEB3_MQ_DID_TYPE.DOTBIT]: '',
//         [WEB3_MQ_DID_TYPE.PHONE]: '',
//         [WEB3_MQ_DID_TYPE.EMAIL]: '',
//       },
//     };
//     // 组装did数据
//     if (info.bind_did_list && info.bind_did_list.length > 0) {
//       info.bind_did_list.forEach((item: any) => {
//         userInfo.didValueMap[item.did_type as WEB3_MQ_DID_TYPE] = item.did_value;
//       });
//     }
//     const oriDidValue = {
//       ...userInfo.didValueMap,
//     };
//     // get ens name and bind ens
//     let ensName = '';
//     try {
//       const name = await getEnsNameByAddress(info.wallet_address);
//       ensName = name || '';
//     } catch (e: any) {
//     }
//     if (!ensName) {
//       try {
//         const rss3Dids = await getDidsByRss3(info.wallet_address);
//         if (rss3Dids && rss3Dids.ensInfo) {
//           if (rss3Dids.ensInfo.handle) {
//             ensName = rss3Dids.ensInfo.handle;
//           }
//           if (rss3Dids.ensInfo.name) {
//             ensName = rss3Dids.ensInfo.name;
//           }
//         }
//       } catch (e: any) {
//         console.log(e);
//       }
//     }

//     // username
//     if (info.nickname) {
//       userInfo.defaultUserName = info.nickname;
//     }
//     if (ensName) {
//       userInfo.defaultUserName = ensName;
//       userInfo.didValueMap.ens = ensName;
//       if (!oriDidValue.ens && bindDid) {
//         await client.user.userBindDid({
//           providerId: PROVIDER_ID_CONFIG.ens,
//           didType: WEB3_MQ_DID_TYPE.ENS,
//           didValue: ensName,
//         });
//       }
//     }

//     if (info.avatar_url) {
//       userInfo.defaultUserAvatar = info.avatar_url;
//     }
//     return userInfo;
//   }
//   return null;
// };