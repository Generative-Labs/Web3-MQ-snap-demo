import { defaultSnapOrigin, defaultSnapVersion } from "../../config";
import { GetSnapsResponse, Snap } from "../../types";

export class BaseSnapClient {
  snapId = defaultSnapOrigin;
  isFlaskDetected = false;
  installedSnap: Snap | undefined = undefined;
  isWeb3MqConnected = false;

  constructor(snapId: string = defaultSnapOrigin) {
    this.snapId = snapId;
  }

  async detect() {
    let isFlaskDetected = false;
    let installedSnap = undefined;
    let isWeb3MqConnected = false;

    try {
      isFlaskDetected = await this.isFlask();
      this.isFlaskDetected = isFlaskDetected;
    } catch (error) {
      console.error(error)
      return {
        isFlaskDetected,
        installedSnap,
        isWeb3MqConnected,
      }
    }
    try {
      installedSnap = await this.getSnap();
      this.installedSnap = installedSnap;
    } catch (error) {
      console.error(error)
      return {
        isFlaskDetected,
        installedSnap,
        isWeb3MqConnected,
      }
    }


    if (isFlaskDetected && installedSnap) {
      try {
        isWeb3MqConnected = await this.detectIsWeb3MqConnected()
        this.isWeb3MqConnected = isWeb3MqConnected
      } catch (error) {
        return {
          isFlaskDetected,
          installedSnap,
          isWeb3MqConnected,
        }
      }
    }
    return {
      isFlaskDetected,
      installedSnap,
      isWeb3MqConnected,
    };
  }

  // for override
  detectIsWeb3MqConnected = async (): Promise<boolean> => false

  /**
   * Detect if the wallet injecting the ethereum object is Flask.
   *
   * @returns True if the MetaMask version is Flask, false otherwise.
   */
  isFlask = async () => {
    const provider = window.ethereum;

    try {
      const clientVersion = await provider?.request({
        method: "web3_clientVersion",
      });

      const isFlaskDetected = (clientVersion as string[])?.includes("flask");

      return Boolean(provider && isFlaskDetected);
    } catch {
      return false;
    }
  };

  /**
   * Get the installed snaps in MetaMask.
   *
   * @returns The snaps installed in MetaMask.
   */
  getSnaps = async (): Promise<GetSnapsResponse> => {
    return (await window.ethereum.request({
      method: "wallet_getSnaps",
    })) as unknown as GetSnapsResponse;
  };

  getSnap = async (version?: string): Promise<Snap | undefined> => {
    try {
      const snaps = await this.getSnaps();

      return Object.values(snaps).find(
        (snap) =>
          snap.id === this.snapId && (!version || snap.version === version)
      );
    } catch (e) {
      console.log("Failed to obtain installed snap", e);
      return undefined;
    }
  };

  /**
   * Connect a snap to MetaMask.
   *
   * @param snapId - The ID of the snap.
   * @param params - The params to pass with the snap to connect.
   */
  connectSnap = async (
    snapId: string = defaultSnapOrigin,
    params: Record<"version" | string, unknown> = defaultSnapVersion
  ) => {
    await window.ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params,
      },
    });
  };

  createSnapRpc<P, R = any>(method: string) {
    return async (params: P): Promise<R> => {
      return new Promise<R>((resolve, reject) => {
        setTimeout(() => {
          reject('snap rpc timeout error')
        }, 5000)
        window.ethereum.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: this.snapId,
            request: { method, params },
          },
        }).then(resolve)
      })
    }
  }
}
