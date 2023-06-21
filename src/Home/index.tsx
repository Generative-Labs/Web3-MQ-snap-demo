import React, { useEffect } from "react";

import {
  IonAlert,
  useIonLoading,
} from "@ionic/react";

import {
  getKeys,
  getLoginUserId,
} from "../services/utils/utils";
import { useStore } from "../services/mobx/service";
import { observer } from "mobx-react";
import MobileDemo from "../components/MobileDemo";
import { useSnaps } from "../hooks/useSnaps";
import Channels from "../components/Channels";
import Contacts from "../components/Contacts";
import { Header } from "../components/Header";

import "./Home.scss";


const Home: React.FC = () => {
  const store = useStore();
  const {
    showAlert,
    setShowAlert,
    errorMessage,
    setErrorMessage,
    setLoginUserId,
  } = store;
  const [present, dismiss] = useIonLoading();
  const { getChannelList } = useSnaps();

  useEffect(() => {
    const init = async () => {
      if (getKeys()) {
        await dismiss();
        await present({
          message: "Loading...",
        });
        setLoginUserId(getLoginUserId());
        await getChannelList();
        await dismiss();
      }
    };
    init();
  }, []);



  return (
    <div className="container">
      <Header />
      <main className="mainContainer">
        <div className="content">
          <Channels />
          <Contacts />
          <MobileDemo />
        </div>
      </main>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => {
          setShowAlert(false);
          setErrorMessage("");
        }}
        header={"Error"}
        message={errorMessage}
        buttons={["Dismiss"]}
      />
    </div>
  );
};

export default observer(Home);
