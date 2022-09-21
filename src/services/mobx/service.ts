import { action, makeAutoObservable, observable, runInAction } from "mobx";
import React from "react";
import {isConnected, setConnected} from "../utils/utils";
import {connectWeb3MQSnaps} from "../utils/snaps";

export default class AppStore {
  showLoading: boolean = false;
  messageList: any[] = []
  num: number = 1
  isConnected: boolean = false
  currentMessages: any = null
  channelList: any[] = []
  activeChannel: string = ''

  setActiveChannel = (data: string) => {
    runInAction(() => {
      this.activeChannel = data;
    });
  }

  setShowLoading = (data: boolean) => {
    runInAction(() => {
      this.showLoading = data;
    });
  };
  setIsConnected = (data: boolean) => {
    runInAction(() => {
      this.isConnected = data;
    });
  };


  setCurrentMessages = (data: any) => {
    runInAction(() => {
      this.currentMessages = data;
    });
  };

  setMessageList = (data: any[]) => {
    runInAction(() => {
      this.messageList = data;
    });
  };
  setChannelList = (data: any[]) => {
    runInAction(() => {
      this.channelList = data;
    });
  };

  testAdd = () => {
    ++this.num
  }

  constructor() {
    makeAutoObservable(this); //even though this isn't required in some examples, this seems key line to making mobx work
  }
}

export const StoreContext = React.createContext(new AppStore());
export const StoreProvider = StoreContext.Provider;
export const useStore = () => React.useContext(StoreContext);
