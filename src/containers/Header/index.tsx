import React, { createContext, useState } from "react";

import logPng from '../../assets/snap_web3Mq@3x.png'
import "./Header.scss";


export const Header: React.FC = () => {
  return (
    <header className="snapHeader">
      <img className="logo" src={logPng} alt="logo"/>
      <div></div>
    </header>
  )
};


