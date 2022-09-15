import { createStore } from './createStore';

interface LayoutUIState {
  isProfileDrawerOnMobileVisible: boolean;
}

let initialState: LayoutUIState = {
  isProfileDrawerOnMobileVisible: false,
};

export const layoutUIStore = createStore(initialState);

export const toggleProfileDrawerOnMobileVisible = (): void => {
  layoutUIStore.setState((prevState) => ({
    isProfileDrawerOnMobileVisible: !prevState.isProfileDrawerOnMobileVisible,
  }));
};

export const closeProfileDrawerOnMobileVisible = (): void => {
  layoutUIStore.setState({
    isProfileDrawerOnMobileVisible: false,
  });
};
