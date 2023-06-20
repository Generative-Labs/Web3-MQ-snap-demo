/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

export const getEthAccount = async () => {
  let address = '';
  let reqParams = {
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }],
  };
  // @ts-ignore
  const requestPermissionsRes = await window.ethereum.request(reqParams).catch((e: any) => {
    console.log(e, 'err');
  });

  if (!requestPermissionsRes) {
    return { address };
  }

  try {
    //@ts-ignore
    let addresses = await window.ethereum.request({
      method: 'eth_accounts',
    });
    if (addresses && addresses.length > 0) {
      address = addresses[0];
    }
  } catch (err) {
    console.log(err);
  }
  return { address };
};

export const signWithEth = async (
    signContent: string,
    didValue: string,
): Promise<{
  sign: string;
  publicKey?: string;
}> => {
  // @ts-ignore metamask signature
  const sign = await window.ethereum.request({
    method: 'personal_sign',
    params: [signContent, didValue, 'web3mq'],
  });
  return {
    sign,
  };
};