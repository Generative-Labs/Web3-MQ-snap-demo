
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



export function getShortAddressByAddress(address: string) {
  let strLength = address.length;
  return (
      address.substring(0, 10) +
      "..." +
      address.substring(strLength - 4, strLength)
  );
}


