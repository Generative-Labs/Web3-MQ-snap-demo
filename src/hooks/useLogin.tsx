import { useCallback } from "react";
import {
  ConnectRpcDto,
  RegisterToWeb3MQDto,
  WalletType,
} from "../services/snap/dto";

import { useSnapClient } from "./useSnapClient";
import { getEthAccount, signWithEth } from "../utils/metamask";


export type ConnectMQParamType = {
  userid: string;
  address: string;
  password: string;
};

export function useConnectMQ() {
  const { snapClient } = useSnapClient();

  const getNewMainKeys = useCallback(
    async (address: string, password: string, walletType?: WalletType) => {
      const { signContent } = await snapClient.getMainKeySignContent({
        password,
        walletType: walletType || "eth",
        address,
      });
      const { sign } = await signWithEth(signContent, address);
      const { publicKey, secretKey } =
        await snapClient.getMainKeypairBySignature({
          signature: sign,
          password,
        });
      return { publicKey, secretKey };
    },
    [snapClient]
  );

  const detectUser = useCallback(async () => {
    const { address } = await getEthAccount();
    if (!address) {
      return null
    }
    const { userExist, userid } = await snapClient.checkUserExist({ address });
    return {
      address,
      userid,
      userExist,
    };
  }, [snapClient]);

  const connect = useCallback(
    async ({ userid, password, address }: ConnectMQParamType) => {
      const { publicKey, secretKey } = await getNewMainKeys(address, password);
      const params: ConnectRpcDto = {
        walletAddress: address,
        password,
        mainPublicKey: publicKey,
        mainPrivateKey: secretKey,
        userid,
      };
      return snapClient.connectToWeb3MQ(params);
    },
    [getNewMainKeys, snapClient]
  );

  
  const signUpAndConnect = useCallback(
    async ({ userid, password, address }: ConnectMQParamType) => {
      const { publicKey, secretKey } = await getNewMainKeys(address, password);
      const signContentRes = await snapClient.getRegisterSignContent({
        userid,
        mainPublicKey: publicKey,
        walletAddress: address,
        walletType: 'eth',
      });
      const { signContent, registerTime } = signContentRes;
      const { sign } = await signWithEth(signContent, address);
      const params: RegisterToWeb3MQDto = {
        walletAddress: address,
        password,
        mainPublicKey: publicKey,
        mainPrivateKey: secretKey,
        walletType: "eth",
        signature: sign,
        registerSignContent: signContent,
        registerTime,
        userid,
      };
      return snapClient.registerToWeb3MQNetwork(params);
    },
    [getNewMainKeys, snapClient]
  );
  return {
    detectUser,
    connect,
    signUpAndConnect,
  }
}
