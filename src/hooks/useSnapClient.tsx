import { ReactNode, Reducer, createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { SnapClient } from "../services/snap/SnapClient";
import { Snap } from "../types";

const snapClient: SnapClient = new SnapClient();

export enum MetamaskActions {
  SetInstalled = "SetInstalled",
  SetFlaskDetected = "SetFlaskDetected",
  SetError = "SetError",
}

export type MetamaskState = {
  isFlask: boolean;
  installedSnap: Snap | undefined;
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

    default:
      return state;
  }
};

const initialState: MetamaskState = {
  isFlask: false,
  error: undefined,
  installedSnap: undefined,
};


const SnapContext = createContext({
  state: initialState,
  snapClient,
  dispatch: (value: MetamaskDispatch) => {},
});

export const SnapProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    snapClient.detect().then((res) => {
      dispatch({
        type: MetamaskActions.SetFlaskDetected,
        payload: res.isFlaskDetected,
      });
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: res.installedSnap,
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
