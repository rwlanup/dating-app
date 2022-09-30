import { createStore } from './createStore';

interface ChatUIState {
  shouldScroll: boolean;
}

let initialChatUIState: ChatUIState = {
  shouldScroll: true,
};

export const chatUIStore = createStore(initialChatUIState);

export const enableChatScroll = () => {
  chatUIStore.setState({
    shouldScroll: true,
  });
};

export const disableChatScroll = () => {
  chatUIStore.setState({
    shouldScroll: false,
  });
};
