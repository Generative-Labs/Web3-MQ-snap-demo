import { makeAutoObservable, runInAction } from "mobx";
import React from "react";

export default class AppStore {
  messageList: any[] = [];
  num: number = 1;
  isConnected: boolean = false;
  currentMessages: any = null;
  channelList: any[] = [];
  searchUsers: any[] | null = null;
  activeChannel: string = "";
  loginUserId?: string = "";
  showAlert: boolean = false;
  errorMessage: string = "";
  activeChannelItem: any = null;
  activeUser: any = null;

  setActiveChannelItem = (data: any) => {
    console.log(data, "setActiveChannelItem");
    runInAction(() => {
      this.activeChannelItem = data;
      this.activeUser = null;
    });
  };
  setActiveUser = (data: any) => {
    console.log(data, "setActiveUser");
    runInAction(() => {
      this.activeUser = data;
      this.activeChannelItem = null;
    });
  };

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
      this.channelList = data;
    });
  };
  setSearchUsers = (data: any[]) => {
    runInAction(() => {
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
