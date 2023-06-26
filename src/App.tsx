import React, { createContext, useState } from "react";

import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import { setupIonicReact } from "@ionic/react";
import DetectUserExsit from "./Login";
import { useStore } from "./services/mobx/service";
import Home from "./Home";
import { observer } from "mobx-react";
import { SnapProvider, useSnapClient } from "./hooks/useSnapClient";
import NotFlaskLogin from "./Login/NotFlaskLogin";
import NotSnapIntalledLogin from "./Login/NotSnapIntalledLogin";
import Login from "./Login/Login";


const _App: React.FC = () => {
  const { isConnected } = useStore();
  const { state } = useSnapClient();
  setupIonicReact({
    mode: "ios",
  });
  console.log(state, 'state in App.tsx')

  if (!state.isFlask) {
    return <NotFlaskLogin />
  } else if (!state.installedSnap) {
    return <NotSnapIntalledLogin />
  } else if (!isConnected) {
    // todo: isConnected not always work
    return <Login />
  }
  return (
      <Home />
  )
};

const _AppWithStore = observer(_App)
const App = () => {

  return (
    <SnapProvider>
      <_AppWithStore/>
    </SnapProvider>
  )
}
export default observer(App);


