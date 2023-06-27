import React, {  } from "react";

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
import { useEffect } from 'react';
import { setupIonicReact, useIonLoading } from "@ionic/react";
import Home from "./Home";
import { observer } from "mobx-react";
import { SnapProvider, useSnapClient } from "./hooks/useSnapClient";
import NotFlaskLogin from "./containers/Login/NotFlaskLogin";
import NotSnapIntalledLogin from "./containers/Login/NotSnapIntalledLogin";
import Login from "./containers/Login/Login";


const _App: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  const { state, snapClient } = useSnapClient();
  setupIonicReact({
    mode: "ios",
  });

  useEffect(() => {
    if (state.loading) {
      present('loading')
    } else {
      dismiss()
    }
  }, [dismiss, present, state.loading])
  if (state.loading) {
    return <Home />
  } else if (!state.isFlask) {
    return <NotFlaskLogin />
  } else if (!state.installedSnap) {
    return <NotSnapIntalledLogin />
  } else if (!state.isWeb3MqConnected) {
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


