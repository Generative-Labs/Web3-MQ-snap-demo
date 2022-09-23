import { makeAutoObservable, runInAction } from "mobx";
import React from "react";
import { getKeys } from "../utils/utils";

export default class AppStore {
  showLoading: boolean = false;
  messageList: any[] = [];
  num: number = 1;
  isConnected: boolean = false;
  currentMessages: any = null;
  channelList: any[] = [];
  searchUsers: any[] = [];
  activeChannel: string = "";
  loginUserId?: string = "";
  showAlert: boolean = false;
  errorMessage: string = "";

  setLoginUserId = (data: string) => {
    runInAction(() => {
      this.loginUserId = data;
    });
  };

  setActiveChannel = (data: string) => {
    runInAction(() => {
      this.activeChannel = data;
    });
  };
  setErrorMessage = (data: string) => {
    runInAction(() => {
      this.errorMessage = data;
    });
  };

  setShowLoading = (data: boolean) => {
    runInAction(() => {
      this.showLoading = data;
    });
  };
  setShowAlert = (data: boolean) => {
    runInAction(() => {
      this.showAlert = data;
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
      this.searchUsers = [];
      this.channelList = data;
    });
  };
  setSearchUsers = (data: any[]) => {
    runInAction(() => {
      this.channelList = [];
      this.searchUsers = data;
    });
  };

  testAdd = () => {
    ++this.num;
  };

  constructor() {
    makeAutoObservable(this); //even though this isn't required in some examples, this seems key line to making mobx work
  }
}

export const StoreContext = React.createContext(new AppStore());
export const StoreProvider = StoreContext.Provider;
export const useStore = () => React.useContext(StoreContext);
