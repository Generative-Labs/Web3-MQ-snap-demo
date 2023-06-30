import { makeAutoObservable, observable, runInAction } from "mobx";
import React from "react";
import {ContactListItemType, SearchContactListItemType} from "../snap/dto";

export default class AppStore {
  messageList: any[] = [];
  num: number = 1;
  isConnected: boolean = false;
  currentMessages: any = null;
  channelList: any[] = [];
  
  searchUsers: SearchContactListItemType[] = [];
  activeChannel: string = "";
  loginUserId?: string = "";
  showAlert: boolean = false;
  errorMessage: string = "";
  activeChannelItem: any = null;
  activeUser: any = null;
  address: string = "";
  followerList: ContactListItemType[] = []
  followingList: ContactListItemType[] = []
  contactsList: ContactListItemType[] = []
  friendRequestList: ContactListItemType[] = []

  setContactsList = (data : ContactListItemType[]) => {
    this.contactsList = data
  }
  setFollowerList = (data : ContactListItemType[]) => {
    this.followerList = data
  }
  setFollowingList = (data : ContactListItemType[]) => {
    this.followingList = data
  }
  setFriendRequestList = (data : ContactListItemType[]) => {
    this.friendRequestList = data
  }

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

  updateTodoItem = (userid: string, follow_status: string) => {
    runInAction(() => {
      const target = this.searchUsers.find(item => item.userid === userid);
      if (target) {
        target.follow_status = follow_status;
      }
    })
  }

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
