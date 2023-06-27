import React, { createContext, useState } from "react";
import { useIonLoading } from "@ionic/react";
import { Button } from "../../components/Button";
import logPng from '../../assets/snap_web3Mq@3x.png'
import { LogoutIcon } from "../../icons";

import "./Header.scss";
import { useSnapClient } from "../../hooks/useSnapClient";


export const Header: React.FC = () => {
  const { snapClient } = useSnapClient()
  const [present, dismiss] = useIonLoading();

  async function disconnect() {
    await present()
    const res = await snapClient.disconnect()
    await dismiss()
    window.location.reload()
  }
  return (
    <header className="snapHeader">
      <img className="logo" src={logPng} alt="logo"/>
      <div>
        <Button className="loggoutBtn" title="Disconnect" icon={<LogoutIcon />} onClick={disconnect}/>
      </div>
    </header>
  )
};


