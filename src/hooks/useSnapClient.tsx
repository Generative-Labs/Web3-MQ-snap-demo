import { ReactNode, Reducer, createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { SnapClient } from "../services/snap/SnapClient";
import { Snap } from "../types";

const snapClient: SnapClient = new SnapClient();

export enum MetamaskActions {
  SetLoading = 'SetLoading',
  SetInstalled = "SetInstalled",
  SetConnected = "SetConnected",
  SetFlaskDetected = "SetFlaskDetected",
  SetError = "SetError",
}

export type MetamaskState = {
  loading: boolean;
  isFlask: boolean;
  installedSnap: Snap | undefined;
  isWeb3MqConnected: boolean;
  error?: Error;
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };

    case MetamaskActions.SetFlaskDetected:
      return {
        ...state,
        isFlask: action.payload,
      };

    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    case MetamaskActions.SetConnected:
      return {
        ...state,
        isWeb3MqConnected: action.payload,
      }
    case MetamaskActions.SetLoading:
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state;
  }
};

const initialState: MetamaskState = {
  isFlask: false,
  error: undefined,
  installedSnap: undefined,
  isWeb3MqConnected: false,
  loading: true,
};


const SnapContext = createContext({
  state: initialState,
  snapClient,
  dispatch: (value: MetamaskDispatch) => {},
});

export const SnapProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: MetamaskActions.SetLoading,
      payload: true,
    });
    snapClient.detect().then((res) => {
      dispatch({
        type: MetamaskActions.SetFlaskDetected,
        payload: res.isFlaskDetected,
      });
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: res.installedSnap,
      });
      dispatch({
        type: MetamaskActions.SetConnected,
        payload: res.isWeb3MqConnected,
      });
    }).finally(() => {
      dispatch({
        type: MetamaskActions.SetLoading,
        payload: false,
      });
    });
  }, [state.isFlask]);
  return (
    <SnapContext.Provider value={{
      state,
      dispatch,
      snapClient,
    }}>
      {children}
    </SnapContext.Provider>
  );
};

export function useSnapClient() {
  const contextValue = useContext(SnapContext);
  return contextValue;
}

export function useConnectSnap() {
  const { snapClient, dispatch } = useSnapClient();
  const handleConnectClick = useCallback(async () => {
    try {
      await snapClient.connectSnap();
      const installedSnap = await snapClient.getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  }, [dispatch, snapClient]);
  return handleConnectClick;
}
