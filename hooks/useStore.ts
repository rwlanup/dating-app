import { useCallback, useSyncExternalStore } from 'react';
import type { CreateStoreReturnType } from '../store/createStore';

interface UseStoreHook<State> {
  <Selected>(
    store: CreateStoreReturnType<State>,
    selector: (state: State) => Selected,
    serverSnapshot: (state: State) => Selected
  ): Selected;
}

export const useStore = <State, Selected>(
  store: CreateStoreReturnType<State>,
  selector: (state: State) => Selected,
  serverSnapshot: (state: State) => Selected
) => {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
    () => serverSnapshot(store.getState())
  );
};
