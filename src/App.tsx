import React, { useCallback, useEffect, useState } from "react";

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
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonLoading,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";

import ss from "./index.module.scss";
import OmsSyntaxHighlight from "./components/OmsSyntaxHighlight";
import { arrowForwardOutline, paw, reloadOutline, send } from "ionicons/icons";
import { useDebounceFn } from "ahooks";
import {
  connectWeb3MQSnaps,
  createRoomsBySnaps,
  getChannelListBySnaps,
  getInstance,
  getKeys,
  getMessagesBySnaps,
  initSnaps,
  isConnected,
  registerBySnaps,
  sendMessageBySnaps,
  setConnected,
  setKeys,
  sleep,
} from "./utils";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  setupIonicReact({
    mode: "ios",
  });
  const [channelListArr, setChannelListArr] = useState<any[]>([]);
  const [readySendMessage, setReadySendMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const getTopic = async () => {
    let channels = channelListArr;
    if (channels.length <= 0) {
      channels = await getChannelList();
      if (channels.length <= 0) {
        await creatRoom();
        channels = await getChannelList();
      }
    }
    let topic = "";
    if (channels[0] && channels[0].topic) {
      topic = channels[0].topic;
    }
    return topic;
  };

  const register = async (showRes: boolean = false) => {
    try {
      const initResponse = await initSnaps();
      if (!getKeys()) {
        if (!initResponse) alert("something was wrong, please retry");
        const registerRes = await registerBySnaps(initResponse);
        setKeys(JSON.stringify(registerRes));
      }
      await getInstance(getKeys());
      await sleep(3000);
    } catch (err: any) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };
  const creatRoom = async (showRes: boolean = false) => {
    try {
      //@ts-ignore
      if (!isConnected()) {
        await connectWeb3Mq();
      }
      const response = await createRoomsBySnaps();
      showRes && setCurrentMessage(JSON.stringify(response, null, "\t"));
      await getChannelList();
    } catch (err: any) {
      console.error(err);
      alert("Problem happened: " + err.message || err);
    }
  };
  const getChannelList = async (showRes: boolean = false) => {
    if (!isConnected()) {
      await connectWeb3Mq();
    }
    const response = await getChannelListBySnaps().catch((e) => {
      console.log(e, "getChannelListBySnaps - error");
    });
    showRes && setCurrentMessage(JSON.stringify(response, null, "\t"));
    await setChannelListArr(response);
    return response;
  };
  const getMessages = async (showRes: boolean = false) => {
    if (!isConnected()) {
      await connectWeb3Mq();
    }
    const res = await getMessagesBySnaps(await getTopic()).catch((e) => {
      console.log(e, "getMessages - error");
    });
    setMessageList(res);
    showRes && setCurrentMessage(JSON.stringify(res, null, "\t"));
  };

  const { run } = useDebounceFn(
    async () => {
      if (!readySendMessage) return;
      if (!isConnected()) {
        await connectWeb3Mq();
      }
      let topic = await getTopic();
      await sendMessageBySnaps(readySendMessage, topic).catch((e) => {
        console.log(e, "sendMessage error");
        setShowLoading(false);
      });
      setReadySendMessage("");
      await getMessages(true);
      setShowLoading(false);
    },
    {
      wait: 500,
    }
  );
  const connectWeb3Mq = async () => {
    await connectWeb3MQSnaps();
    await register();
    setConnected("true");
  };

  useEffect(() => {
    const init = async () => {
      setConnected("");
      if (getKeys()) {
        setShowLoading(true);
        await getChannelList(true);
        setShowLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className={ss.shopContainer}>
      <h1> Web3 MQ test-dapp </h1>
      <div className={ss.content}>
        <div className={ss.left}>
          <h2>Actions</h2>
          <IonCard className={ss.innerBox}>
            <h1>Click to install snaps</h1>
            <IonButton
              onClick={async () => {
                await connectWeb3MQSnaps();
              }}
            >
              Connect Web3 MQ snaps
            </IonButton>
            <div>Step 1: Register and login to get your keys</div>
            <IonButton
              onClick={async () => {
                setShowLoading(true);
                await register(true);
                setShowLoading(false);
              }}
            >
              register and login
            </IonButton>
            <div>Step 2: Create a chat room</div>
            <IonButton
              onClick={async () => {
                setShowLoading(true);
                await creatRoom(true);
                setShowLoading(false);
              }}
            >
              creat room
            </IonButton>
            <div>Step 3: Get your channel list</div>
            <IonButton
              onClick={async () => {
                setShowLoading(true);
                await getChannelList(true);
                setShowLoading(false);
              }}
            >
              get channel list
            </IonButton>
            <div>Step 4: Now! Send your first message</div>
            <IonButton
              onClick={async () => {
                setReadySendMessage("Hello Web3 MQ");
                if (!isConnected()) {
                  setShowLoading(true);
                  await register();
                  setShowLoading(false);
                }
                run();
              }}
            >
              Send Message
            </IonButton>
            <div>Step 6: View Message History</div>
            <IonButton
              onClick={async () => {
                setShowLoading(true);
                await getMessages(true);
                setShowLoading(false);
              }}
            >
              Get messages
            </IonButton>
            <br />
          </IonCard>
        </div>
        <div className={ss.center}>
          <h2>Channels:</h2>
          <IonCard className={ss.innerBox}>
            {channelListArr && channelListArr.length > 0 ? (
              <ul>
                {channelListArr.map((item, index) => (
                  <li key={index}>{item.topic} </li>
                ))}
              </ul>
            ) : null}
          </IonCard>
        </div>
        <div className={ss.right}>
          <h2>Demo</h2>
          {!isConnected() ? (
            <div>
              <IonButton
                onClick={async () => {
                  setShowLoading(true);
                  await connectWeb3MQSnaps();
                  await register();
                  let channels = await getChannelList();
                  if (channels.length <= 0) {
                    await creatRoom();
                    await getChannelList();
                  }
                  setShowLoading(false);
                }}
              >
                Get started now
              </IonButton>
            </div>
          ) : (
            <IonCard className={ss.demoPage}>
              <IonHeader
                style={{
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <IonToolbar>
                  <IonTitle>Web3 MQ Demo</IonTitle>
                  <IonButtons slot="end">
                    <IonButton
                      className="settingIcon"
                      onClick={() => {
                        localStorage.clear();
                        let href = window.location.href;
                        window.location.href = href;
                      }}
                    >
                      <IonIcon
                        style={{ color: "#000", fontSize: "24px" }}
                        slot="icon-only"
                        icon={reloadOutline}
                      />
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className={ss.demoContent}>
                <div className={ss.messageBox}>
                  <ul>
                    {messageList.map((item, index) => (
                      <li key={index}>{item.content} </li>
                    ))}
                  </ul>
                </div>
              </IonContent>
              <IonFooter className={ss.footer}>
                <IonInput
                  className={ss.messageInput}
                  value={readySendMessage}
                  placeholder="Write a message"
                  onIonChange={(e) => {
                    setReadySendMessage(e.detail.value!);
                  }}
                  onKeyDown={async (e) => {
                    if (e.keyCode === 13) {
                      run();
                    }
                  }}
                />
                <IonButton onClick={run}>
                  <IonIcon
                    style={{ color: "#fff", fontSize: "24px" }}
                    slot="icon-only"
                    icon={send}
                  />
                </IonButton>
              </IonFooter>
            </IonCard>
          )}
        </div>
        <div className={ss.bottom}>
          <h2>Responses:</h2>
          <IonCard className={ss.innerBox}>
            {currentMessage && (
              <OmsSyntaxHighlight
                textContent={currentMessage}
                language="json"
              />
            )}
          </IonCard>
        </div>
      </div>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => {
          setShowLoading(false);
        }}
        message={"Loading"}
      />
    </div>
  );
};
export default App;
