type StoreListener<State> = (state: State) => void;

export interface CreateStoreReturnType<State> {
  getState: () => State;
  setState: (newState: Partial<State> | ((prevState: State) => Partial<State>)) => void;
  subscribe: (listener: StoreListener<State>) => () => void;
}

export const createStore = <State>(initialState: State): CreateStoreReturnType<State> => {
  let state = initialState;
  const listeners = new Set<StoreListener<State>>(); // Used because of it's unique items nature

  const getState = () => state;

  return {
    getState,
    setState: (newState) => {
      if (typeof newState === 'function') {
        state = {
          ...state,
          ...newState(state),
        };
      } else {
        state = {
          ...state,
          ...newState,
        };
      }
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
